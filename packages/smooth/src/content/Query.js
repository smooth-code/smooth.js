import React from 'react'
import camelcase from 'camelcase'
import gql from 'graphql-tag'
import { Redirect } from 'react-router-dom'
import { usePageContext } from '../page/PageContext'
import { HTTPError } from '../router/HTTPError'
import { applyHook } from '../plugin/browser'
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
  const fields = applyHook(
    'onSelectContentFields',
    { fields: [`...${fragmentName}`] },
    'fields',
  )

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
  const { page } = usePageContext()

  if (page.slug === 'index') {
    return <Redirect to={page.indexUrl} />
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
