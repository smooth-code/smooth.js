import { gql, createSchemaDefinitionMock, types } from 'smooth-core/graphql'
import { generateConfig } from '.'
import * as cptTypes from '../types'

const helpers = { gql: types, cpt: cptTypes }

function generateConfigFromTypeDefs(typeDefs) {
  const ast = createSchemaDefinitionMock({ typeDefs }).typeDefs
  return generateConfig(ast, helpers)
}

describe('#generateConfig', () => {
  it('should infer label', () => {
    const typeDefs = gql`
      type AwesomeBook @model {
        name: String!
      }
    `

    const [first] = generateConfigFromTypeDefs(typeDefs)
    expect(first.config.label).toBe('Awesome books')
  })

  it('should support custom icon', () => {
    const typeDefs = gql`
      type AwesomeBook @model(icon: "settings") {
        name: String!
      }
    `

    const [first] = generateConfigFromTypeDefs(typeDefs)
    expect(first.config.menu_icon).toBe('settings')
  })

  it('should support custom label', () => {
    const typeDefs = gql`
      type AwesomeBook @model(label: "Books") {
        name: String!
      }
    `

    const [first] = generateConfigFromTypeDefs(typeDefs)
    expect(first.config.label).toBe('Books')
  })

  it('should support custom slug', () => {
    const typeDefs = gql`
      type AwesomeBook @model(slug: "book") {
        name: String!
      }
    `

    const [first] = generateConfigFromTypeDefs(typeDefs)
    expect(first.name).toBe('book')
  })

  it('should ignore other definition than models', () => {
    const typeDefs = gql`
      type AwesomeBook {
        name: String!
      }
    `

    const config = generateConfigFromTypeDefs(typeDefs)
    expect(config).toHaveLength(0)
  })
})
