import path from 'path'
import { GraphQLSchema } from 'graphql'
import { getDefinitionModules, createSchema, createSchemaDefinition } from '.'

const SCHEMAS_FIXTURES_DIR = path.join(__dirname, '../../__fixtures__/schemas')

xdescribe('schema', () => {
  describe('#getDefinitionModules', () => {
    it('should read definition modules from fs', async () => {
      const definitions = await getDefinitionModules({
        config: {
          schemasPath: SCHEMAS_FIXTURES_DIR,
        },
      })
      expect(definitions).toHaveLength(2)
    })
  })

  describe('#createSchemaDefinition', () => {
    it('should create a schema definition', async () => {
      const schemaDefinition = await createSchemaDefinition({
        config: {
          schemasPath: SCHEMAS_FIXTURES_DIR,
          plugins: [],
        },
      })
      expect(schemaDefinition.typeDefs).toHaveProperty('kind', 'Document')
      expect(schemaDefinition.resolvers).toBeDefined()
    })
  })

  describe('#createSchema', () => {
    it('should create a schema', async () => {
      const schema = await createSchema({
        config: {
          schemasPath: SCHEMAS_FIXTURES_DIR,
          plugins: [],
        },
      })
      expect(schema).toBeInstanceOf(GraphQLSchema)
    })
  })
})
