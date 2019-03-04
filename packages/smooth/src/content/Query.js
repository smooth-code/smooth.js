import React, { useContext, useEffect } from 'react'
import camelcase from 'camelcase'
import gql from 'graphql-tag'
import qs from 'query-string'
import { Redirect } from 'react-router-dom'
import { Query as ApolloQuery } from 'react-apollo'
import PageContext from '../client/PageContext'
import { HTTPError } from '../router/HTTPError'
import { applyHook } from '../plugin/browser'
import { HiddenRouterContext } from '../router/HiddenRouter'
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
      $lang: String
      $slug: String!
      $id: String
      $preview: Boolean
    ) {
      contentProps: ${queryField}(
        lang: $lang
        slug: $slug
        id: $id
        preview: $preview
      ) {
        ${fields}
      }
    }

    ${fragment}
  `

  return query
}

function getVariables(location, lang, slug = 'index') {
  const { id, preview } = qs.parse(location.search)
  const variables = { lang, slug }

  if (preview) {
    variables.id = id
    variables.preview = true
  }

  return variables
}

function Handler({ children, ...props }) {
  const hiddenRouter = useContext(HiddenRouterContext)
  useEffect(() => {
    if (hiddenRouter && !props.loading) {
      hiddenRouter.onPrefetched()
    }
  }, [props.loading])

  if (!props.loading && !props.error && !props.data.contentProps) {
    return children({
      ...props,
      error: new HTTPError({ statusCode: 404 }),
    })
  }

  return children(props)
}

export function Query({ children }) {
  return (
    <PageContext.Consumer>
      {({
        page,
        lang,
        match: {
          params: { slug },
        },
        location,
      }) => {
        if (slug === 'index') {
          return <Redirect to={page.indexUrl} />
        }

        return (
          <ApolloQuery
            query={getQuery(page)}
            variables={getVariables(location, lang, slug)}
          >
            {apolloProps => <Handler {...apolloProps}>{children}</Handler>}
          </ApolloQuery>
        )
      }}
    </PageContext.Consumer>
  )
}
