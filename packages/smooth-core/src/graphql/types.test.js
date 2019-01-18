import gql from 'graphql-tag'
import * as types from './types'

function getType(doc) {
  return doc.definitions[0]
}

describe('types', () => {
  describe('#getName', () => {
    it('should return name from a node', () => {
      const typeDef = getType(gql`
        type Book {
          name: String
        }
      `)
      expect(types.getName(typeDef)).toBe('Book')
    })
  })

  describe('#getValue', () => {
    it('should return value from a node', () => {
      const typeDef = getType(gql`
        type Book @block(type: "awesome") {
          name: String
        }
      `)
      expect(types.getValue(typeDef.directives[0].arguments[0])).toBe('awesome')
    })
  })

  describe('#is', () => {
    it('should return false if node does not exist', () => {
      expect(types.is('Type', null)).toBe(false)
      expect(types.is('Type', undefined)).toBe(false)
      expect(types.is('Type', false)).toBe(false)
    })

    it('should return false if node type does not match', () => {
      const typeDef = getType(gql`
        type Book {
          name: String
        }
      `)
      expect(types.is('ObjectTypeDefinition', typeDef)).toBe(true)
      expect(types.is('Directive', typeDef)).toBe(false)
    })

    it('should make a shallow equal if opts are provided', () => {
      const typeDef = getType(gql`
        type Book {
          name: String
        }
      `)
      expect(types.is('Name', typeDef.name, { value: 'Book' })).toBe(true)
      expect(types.is('Name', typeDef.name, { value: 'Other' })).toBe(false)
    })
  })

  describe('#isName', () => {
    it('should return true if node is of type "Name"', () => {
      const typeDef = getType(gql`
        type Book {
          name: String
        }
      `)
      expect(types.isName(typeDef.name)).toBe(true)
      expect(types.isName(typeDef.name, { value: 'Book' })).toBe(true)
      expect(types.isName(typeDef.name, { value: 'Other' })).toBe(false)
      expect(types.isName(typeDef)).toBe(false)
    })
  })

  describe('#isObjectTypeDefinition', () => {
    it('should return true if node is of type "ObjectTypeDefinition"', () => {
      const typeDef = getType(gql`
        type Book {
          name: String
        }
      `)
      expect(types.isObjectTypeDefinition(typeDef)).toBe(true)
    })
  })

  describe('#isDirective', () => {
    it('should return true if node is of type "Directive"', () => {
      const typeDef = getType(gql`
        type Book @block {
          name: String
        }
      `)
      expect(types.isDirective(typeDef.directives[0])).toBe(true)
    })
  })

  describe('#isArgument', () => {
    it('should return true if node is of type "Argument"', () => {
      const typeDef = getType(gql`
        type Book @block(type: "test") {
          name: String
        }
      `)
      expect(types.isArgument(typeDef.directives[0].arguments[0])).toBe(true)
    })
  })

  describe('#getDirective', () => {
    it('should return the first directive matching name', () => {
      const typeDef = getType(gql`
        type Book @block(type: "test") {
          name: String
        }
      `)
      expect(types.getDirective(typeDef, 'block')).toBe(typeDef.directives[0])
    })
  })

  describe('#getArg', () => {
    it('should return the first argument matching name', () => {
      const typeDef = getType(gql`
        type Book @block(type: "test") {
          name: String
        }
      `)
      expect(types.getArg(typeDef.directives[0], 'type')).toBe(
        typeDef.directives[0].arguments[0],
      )
    })
  })

  describe('#getFieldType', () => {
    it('should return field type', () => {
      const typeDef = getType(gql`
        type Book @content {
          name: String @field(type: longText)
        }
      `)
      const [field] = typeDef.fields
      expect(types.getFieldInfos(field)).toEqual({
        description: null,
        name: 'name',
        label: 'Name',
        list: false,
        required: false,
        type: {
          name: 'longText',
          typeNode: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'String' },
          },
        },
      })
    })

    it('should support required', () => {
      const typeDef = getType(gql`
        type Book @content {
          name: String! @field(type: longText)
        }
      `)
      const [field] = typeDef.fields
      expect(types.getFieldInfos(field)).toEqual({
        description: null,
        name: 'name',
        label: 'Name',
        list: false,
        required: true,
        type: {
          name: 'longText',
          typeNode: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'String' },
          },
        },
      })
    })

    it('should support list', () => {
      const typeDef = getType(gql`
        type Book @content {
          name: [String!]! @field
        }
      `)
      const [field] = typeDef.fields
      expect(types.getFieldInfos(field)).toEqual({
        description: null,
        name: 'name',
        label: 'Name',
        list: true,
        required: true,
        type: {
          name: 'shortText',
          typeNode: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'String' },
          },
        },
      })
    })

    it('should support enum', () => {
      const ast = gql`
        enum BookCategory {
          adventure
          romance
        }

        type Book @content {
          category: BookCategory @field
        }
      `
      const [field] = ast.definitions[1].fields
      expect(types.getFieldInfos(field, ast)).toEqual({
        description: null,
        name: 'category',
        label: 'Category',
        list: false,
        required: false,
        type: {
          name: 'enum',
          typeDefinitionNode: {
            description: undefined,
            directives: [],
            kind: 'EnumTypeDefinition',
            name: { kind: 'Name', value: 'BookCategory' },
            values: [
              {
                description: undefined,
                directives: [],
                kind: 'EnumValueDefinition',
                name: { kind: 'Name', value: 'adventure' },
              },
              {
                description: undefined,
                directives: [],
                kind: 'EnumValueDefinition',
                name: { kind: 'Name', value: 'romance' },
              },
            ],
          },
          typeNode: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'BookCategory' },
          },
        },
      })
    })

    it('should support union', () => {
      const ast = gql`
        type Composition @content {
          blocks: [XBlock!]! @field
        }

        type Title {
          title: String @field
        }

        type Paragraph {
          text: String @field
        }

        union XBlock = Title | Paragraph
      `
      const [field] = ast.definitions[0].fields
      expect(types.getFieldInfos(field, ast)).toEqual({
        description: null,
        label: 'Blocks',
        list: true,
        name: 'blocks',
        required: true,
        type: {
          name: 'union',
          typeDefinitionNode: {
            description: undefined,
            directives: [],
            kind: 'UnionTypeDefinition',
            name: { kind: 'Name', value: 'XBlock' },
            types: [
              { kind: 'NamedType', name: { kind: 'Name', value: 'Title' } },
              { kind: 'NamedType', name: { kind: 'Name', value: 'Paragraph' } },
            ],
          },
          typeNode: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'XBlock' },
          },
          types: [
            {
              name: 'object',
              typeDefinitionNode: {
                description: undefined,
                directives: [],
                fields: [
                  {
                    arguments: [],
                    description: undefined,
                    directives: [
                      {
                        arguments: [],
                        kind: 'Directive',
                        name: { kind: 'Name', value: 'field' },
                      },
                    ],
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'title' },
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' },
                    },
                  },
                ],
                interfaces: [],
                kind: 'ObjectTypeDefinition',
                name: { kind: 'Name', value: 'Title' },
              },
              typeNode: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Title' },
              },
            },
            {
              name: 'object',
              typeDefinitionNode: {
                description: undefined,
                directives: [],
                fields: [
                  {
                    arguments: [],
                    description: undefined,
                    directives: [
                      {
                        arguments: [],
                        kind: 'Directive',
                        name: { kind: 'Name', value: 'field' },
                      },
                    ],
                    kind: 'FieldDefinition',
                    name: { kind: 'Name', value: 'text' },
                    type: {
                      kind: 'NamedType',
                      name: { kind: 'Name', value: 'String' },
                    },
                  },
                ],
                interfaces: [],
                kind: 'ObjectTypeDefinition',
                name: { kind: 'Name', value: 'Paragraph' },
              },
              typeNode: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'Paragraph' },
              },
            },
          ],
        },
      })
    })
  })
})
