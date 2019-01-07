import React from 'react'
import camelcase from 'camelcase'
import gql from 'graphql-tag'
import qs from 'query-string'
import { Query } from 'react-apollo'
import HttpError from './HttpError'

export function getContents() {
  const req = require.context(process.env.SMOOTH_CONTENTS_PATH, true, /\.js$/)
  return req
    .keys()
    .map(filePath => {
      const m = req(filePath)
      const {
        contentFragment: fragment = null,
        slug = null,
        default: component,
      } = m

      if (!fragment) return null

      const { name } = component

      if (name !== 'Page' && !slug) {
        throw new Error(`Please provide a slug in model ${name}`)
      }

      const path = slug
        ? `/:lang(.{2})?/${slug}/:slug+`
        : '/:lang(.{2})?/:slug*'

      return {
        hasSlug: Boolean(slug),
        type: name,
        path,
        component,
        fragment,
      }
    })
    .sort((a, b) => (a.hasSlug === b.hasSlug ? 0 : a.hasSlug ? -1 : 1))
    .filter(Boolean)
}

function getQuery({ type, fragment }) {
  const fragmentDefinition = fragment.definitions.find(
    node =>
      node.kind === 'FragmentDefinition' &&
      node.typeCondition.kind === 'NamedType' &&
      node.typeCondition.name.value === type,
  )

  return gql`
    query Content(
      $lang: String
      $slug: String!
      $id: String
      $preview: Boolean
    ) {
      content: ${camelcase(type)}(
        lang: $lang
        slug: $slug
        id: $id
        preview: $preview
      ) {
        ...${fragmentDefinition.name.value}
      }
    }

    ${fragment}
  `
}

export default function Content({
  component: Component,
  slug,
  lang = null,
  location,
  type,
  fragment,
}) {
  const { id, preview } = qs.parse(location.search)

  const variables = { lang, slug }
  if (preview) {
    variables.id = id
    variables.preview = true
  }

  const metadata = { lang }

  return (
    <Query query={getQuery({ type, fragment })} variables={variables}>
      {({ loading, error, data }) => {
        if (loading) return null
        if (error) {
          throw error
        }

        if (!data.content) {
          throw new HttpError({ statusCode: 404 })
        }

        return <Component {...data.content} metadata={metadata} />
      }}
    </Query>
  )
}
