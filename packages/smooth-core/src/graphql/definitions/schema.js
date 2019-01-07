import gql from 'graphql-tag'

export const typeDefs = gql`
  schema {
    query: Query
    mutation: Mutation
  }
`
