import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import fragmentTypes from '__smooth_fragmentTypes'

export function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: '/graphql',
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData: fragmentTypes,
      }),
    }).restore(window.__APOLLO_STATE__),
  })
}
/* eslint-enable no-underscore-dangle */
