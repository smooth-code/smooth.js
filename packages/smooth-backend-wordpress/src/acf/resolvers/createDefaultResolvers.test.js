import { gql, createSchemaDefinitionMock, types } from 'smooth/graphql'
import createDefaultResolvers from './createDefaultResolvers'

describe('createDefaultResolvers', () => {
  it('should create default resolvers', () => {
    const typeDefs = gql`
      type Group {
        shortText: String @field(type: shortText)
        shortTextArray: [String] @field(type: shortText)
        image: Image @field
      }

      type Book @content {
        name: String! @field
        group: Group @field
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
    expect(resolvers.Group.image({ image: false })).toBe(null)
    expect(resolvers.Group.shortText({ shortText: 'Hello' })).toBe('Hello')
    expect(
      resolvers.Group.shortTextArray({ shortTextArray: 'Hello,foo,bar' }),
    ).toEqual(['Hello', 'foo', 'bar'])
  })
})
