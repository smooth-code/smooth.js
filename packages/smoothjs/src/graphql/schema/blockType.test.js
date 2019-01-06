import path from 'path'
import { createSchemaDefinition } from '.'
import { addBlockTypeDefinitions } from './blockType'
import * as types from '../types'

describe('dynamicTypes', () => {
  describe('#addBlockTypeDefinitions', () => {
    xit('should add Block type defintion', () => {
      const rootDir = path.join(__dirname, '../../__fixtures__/schemas')
      const schemaDefinition = createSchemaDefinition({ rootDir })
      addBlockTypeDefinitions(schemaDefinition)
      const blockDefinition = schemaDefinition.typeDefs.definitions.find(
        def =>
          types.isObjectTypeDefinition(def) &&
          types.isName(def.name, { value: 'Block' }),
      )
      expect(blockDefinition.fields).toHaveLength(2)
      const fieldNames = blockDefinition.fields.map(field => field.name.value)
      expect(fieldNames).toContain('type')
      expect(fieldNames).toContain('MovieCard_props')
    })
  })
})
