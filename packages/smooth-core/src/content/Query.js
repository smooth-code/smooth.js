import React from 'react'
import camelcase from 'camelcase'
import gql from 'graphql-tag'
import qs from 'query-string'
import { Redirect } from 'react-router-dom'
import { Query as ApolloQuery } from 'react-apollo'
import PageContext from '../client/PageContext'
import { HTTPError } from '../router'
import { applyHook } from '../plugin/browser'
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
            {apolloProps => {
              if (
                !apolloProps.loading &&
                !apolloProps.error &&
                !apolloProps.data.contentProps
              ) {
                return children({
                  ...apolloProps,
                  error: new HTTPError({ statusCode: 404 }),
                })
              }

              return children(apolloProps)
            }}
          </ApolloQuery>
        )
      }}
    </PageContext.Consumer>
  )
}
