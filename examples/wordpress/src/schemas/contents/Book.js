import gql from 'graphql-tag'

export const typeDefs = gql`
  type Book @content {
    name: String @field
  }
`
