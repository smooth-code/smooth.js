import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { SchemaLink } from 'apollo-link-schema'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { ValidateLink } from './links/validate'
import { createAPIClient } from '../api'

export function getContext({ req, config, operationContext }) {
  const headers =
    (operationContext ? operationContext.headers : req.headers) || {}
  const lang = headers['x-smooth-lang'] || null
  const preview = Boolean(headers['x-smooth-preview'])
  const id = headers['x-smooth-preview-id'] || null
  return {
    api: createAPIClient({ config, lang }),
    lang,
    id,
    preview,
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
