import { gql, createSchemaDefinitionMock, types } from 'smooth-core/graphql'
import createDefaultResolvers from './createDefaultResolvers'

describe('createDefaultResolvers', () => {
  it('should create default resolvers', () => {
    const typeDefs = gql`
      type Book @content {
        name: String! @field
      }

      type BookCard @block {
        book: Book! @field
        books: [Book]! @field
        multiple: [String] @field
      }
    `
    const schemaDefinition = createSchemaDefinitionMock({ typeDefs })
    const resolvers = createDefaultResolvers(schemaDefinition, { types })
    expect(resolvers.Query.book).toBeDefined()
    expect(resolvers.Book).toBeDefined()
    expect(
      resolvers.BookCard.book({ acf: { book: { acf: { name: 'Hello' } } } }),
    ).toEqual({ acf: { name: 'Hello' } })
    expect(
      resolvers.BookCard.multiple({ acf: { multiple: 'hello,you' } }),
    ).toEqual(['hello', 'you'])
  })
})
