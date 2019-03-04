import gql from 'graphql-tag'

export const typeDefs = gql`
  type Metadata {
    id: ID!
    slug: String!
  }
`
