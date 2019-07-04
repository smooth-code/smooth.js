import React from 'react'
import camelcase from 'camelcase'
import gql from 'graphql-tag'
import { Redirect, useRouter } from '../router'
import { usePage } from '../page/PageContext'
import { HTTPError } from '../router/HTTPError'
import { onSelectContentFields } from '../plugin/browserHooks'
import { Query as BaseQuery } from '../query/Query'
import {
  getFragmentDefinition,
  getFragment,
  getDefinitionType,
  getDefinitionName,
} from './util'

function getQueryField(type) {
  return camelcase(type)
}

function getQuery(page) {
  const fragment = getFragment(page.module, 'contentFragment', page.filePath)
  const fragmentDefinition = getFragmentDefinition(fragment, page.filePath)
  const type = getDefinitionType(fragmentDefinition)
  const queryField = getQueryField(type)
  const fragmentName = getDefinitionName(fragmentDefinition)
  const fields = onSelectContentFields({ fragmentName })

  const query = gql`
    query Content(
      $slug: String!
    ) {
      contentProps: ${queryField}(slug: $slug) {
        ${fields}
      }
    }

    ${fragment}
  `

  return query
}

function Handler({ children, ...props }) {
  if (!props.loading && !props.error && !props.data.contentProps) {
    return children({
      ...props,
      error: new HTTPError({ statusCode: 404 }),
    })
  }

  return children(props)
}

export function Query({ children }) {
  const page = usePage()
  const { location } = useRouter()

  if (page.slug === 'index') {
    return <Redirect to={`${page.indexUrl}${location.search}`} />
  }

  return (
    <BaseQuery
      query={getQuery(page)}
      variables={{ slug: page.slug || 'index' }}
      pageContent
    >
      {apolloProps => <Handler {...apolloProps}>{children}</Handler>}
    </BaseQuery>
  )
}
