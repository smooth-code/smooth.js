import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { ValidateLink } from './links/validate'
import { createAPIClient } from '../api'

function getLang(url) {
  const matches = url.match(/^\/(.{2})\//)
  return matches ? matches[1] : null
}

export function getContext({ req, config }) {
  return {
    api: createAPIClient({ config, lang: getLang(req.url) }),
    lang: getLang(req.url),
    cookie: req.headers.cookie,
  }
}

export function createApolloClient({ schema, context, fragmentTypes }) {
  return new ApolloClient({
    ssrMode: true,
    link: ApolloLink.from([
      new ValidateLink({ schema }),
      new SchemaLink({ schema, context }),
    ]),
    cache: new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData: fragmentTypes,
      }),
    }),
  })
}
