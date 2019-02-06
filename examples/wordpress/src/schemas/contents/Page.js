import gql from 'graphql-tag'

export const typeDefs = gql`
  type Page @content {
    title: String @field
    book: Book @field
    specificBook: Book
    allBooks: [Book]
    date: Date @field
    dateTime: DateTime @field
    link: Link @field
    blocks: [Block] @field
    file: Media @field
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
