import gql from 'graphql-tag'

export const typeDefs = gql`
  type Media {
    title: String
    url: String!
  }
`
