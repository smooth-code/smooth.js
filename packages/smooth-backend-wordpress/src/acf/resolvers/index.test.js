import { gql, createSchemaDefinitionMock, types } from 'smooth/graphql-node'
import { createResolvers } from '.'

describe('createResolvers', () => {
  it('should create all resolvers', () => {
    const typeDefs = gql`
      type Book @content {
        name: String! @field
      }

      type BookCard @block {
        book: Book! @field
        books: [Book]! @field
        other: String @field
      }
    `
    const schemaDefinition = createSchemaDefinitionMock({ typeDefs })
    const resolvers = createResolvers(
      {
        schemaDefinition,
        types,
      },
      { baseUrl: '/' },
    )

    expect(resolvers.Block).toBeDefined()
    expect(resolvers.Query).toBeDefined()
    expect(resolvers.Book).toBeDefined()
    expect(resolvers.BookCard).toBeDefined()
  })
})
