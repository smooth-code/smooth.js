import gql from 'graphql-tag'

export const typeDefs = gql`
  type Page @model {
    title: String @field
    book: Book @field
    specificBook: Book
    allBooks: [Book]
  }
`

export const resolvers = {
  Page: {
    async specificBook(object, params, { api }) {
      return api.getContent({
        type: 'Book',
        slug: 'harry-potter',
      })
    },
    async allBooks(object, params, { api }) {
      return api.getContents({
        type: 'Book',
      })
    },
  },
}
