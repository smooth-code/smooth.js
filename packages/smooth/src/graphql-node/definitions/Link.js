import gql from 'graphql-tag'

export const typeDefs = gql`
  type Link {
    title: String
    url: String!
    target: String!
  }
`
