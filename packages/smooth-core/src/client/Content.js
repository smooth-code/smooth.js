import React from 'react'
import camelcase from 'camelcase'
import gql from 'graphql-tag'
import qs from 'query-string'
import { Redirect } from 'react-router-dom'
import { Query } from 'react-apollo'
import { HTTPError } from './HttpError'
import {
  getFragmentDefinition,
  getFragment,
  getDefinitionType,
  getDefinitionName,
} from './util'

function getQueryField(type) {
  return camelcase(type)
}

function getQuery(exp, page) {
  const fragment = getFragment(exp, 'contentFragment', page.filePath)
  const fragmentDefinition = getFragmentDefinition(fragment, page.filePath)
  const type = getDefinitionType(fragmentDefinition)
  const queryField = getQueryField(type)
  const fragmentName = getDefinitionName(fragmentDefinition)

  return gql`
    query Content(
      $lang: String
      $slug: String!
      $id: String
      $preview: Boolean
    ) {
      content: ${queryField}(
        lang: $lang
        slug: $slug
        id: $id
        preview: $preview
      ) {
        ...${fragmentName}
      }
    }

    ${fragment}
  `
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

export default function Content({
  lang,
  page,
  exp,
  match: {
    params: { slug },
  },
  location,
  indexUrl,
}) {
  if (slug === 'index') {
    return <Redirect to={indexUrl} />
  }
  return (
    <Query
      query={getQuery(exp, page)}
      variables={getVariables(location, lang, slug)}
    >
      {({ loading, error, data }) => {
        if (loading) return null
        if (error) {
          throw error
        }

        if (!data.content) {
          throw new HTTPError({ statusCode: 404 })
        }

        const Component = exp.default
        return <Component {...data.content} />
      }}
    </Query>
  )
}
