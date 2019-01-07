import { gql, createSchemaDefinitionMock, types } from 'smooth-core/graphql'
import createDefaultResolvers from './createDefaultResolvers'

describe('createDefaultResolvers', () => {
  it('should create default resolvers', () => {
    const typeDefs = gql`
      type Book @model {
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
      resolvers.BookCard.book({ book: { acf: { name: 'Hello' } } }),
    ).toEqual({ name: 'Hello' })
    expect(resolvers.BookCard.multiple({ multiple: 'hello\nyou' })).toEqual([
      'hello',
      'you',
    ])
  })
})
