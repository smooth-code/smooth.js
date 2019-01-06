import gql from 'graphql-tag'
import { createSchemaDefinitionMock, types } from '../../../../graphql'
import { createResolvers } from '.'

describe('createResolvers', () => {
  it('should create all resolvers', () => {
    const typeDefs = gql`
      type Book @model {
        name: String! @field
      }

      type BookCard @block {
        book: Book! @field
        books: [Book]! @field
        other: String @field
      }
    `
    const schemaDefinition = createSchemaDefinitionMock({ typeDefs })
    const resolvers = createResolvers({
      options: { baseUrl: '/' },
      schemaDefinition,
      types,
    })

    expect(resolvers.Block).toBeDefined()
    expect(resolvers.Query).toBeDefined()
    expect(resolvers.Book).toBeDefined()
    expect(resolvers.BookCard).toBeDefined()
  })
})
