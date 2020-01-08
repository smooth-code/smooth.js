import gql from 'graphql-tag'

export const typeDefs = gql`
  type SimpleBlock @block {
    text: String @field
  }

  type BookBlock @block {
    book: Book @field
  }
`
