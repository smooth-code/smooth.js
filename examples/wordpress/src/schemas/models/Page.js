import gql from 'graphql-tag'

export const typeDefs = gql`
  type Page @model {
    title: String @field
    book: Book @field
  }
`
