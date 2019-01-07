import gql from 'graphql-tag'

export const typeDefs = gql`
  type Book @model {
    name: String @field
  }
`
