import gql from 'graphql-tag'

export const typeDefs = gql`
  type Book @content {
    name: String @field
    test: String @field
    author: Author! @field
    price: Int!
  }

  type Author @content {
    name: String @field
  }
`

export const resolvers = {
  Book: {
    async price() {
      return Math.round(Math.random() * 10)
    },
  },
}
