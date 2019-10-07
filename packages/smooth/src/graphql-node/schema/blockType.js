import gql from 'graphql-tag'
import * as t from '../types'

export function addBlockTypeDefinitions(schemaDefinition) {
  const { typeDefs } = schemaDefinition
  const blockDefinitions = typeDefs.definitions.filter(
    typeDefinition =>
      t.isObjectTypeDefinition(typeDefinition) &&
      t.hasDirective(typeDefinition, directive =>
        t.isName(directive.name, { value: 'block' }),
      ),
  )

  const {
    definitions: [blockDefinition],
  } = gql`
    type Block {
      type: String!
      ${blockDefinitions
        .map(def => `${def.name.value}_props: ${def.name.value}`)
        .join('\n')}
    }
  `

  typeDefs.definitions.push(blockDefinition)

  return schemaDefinition
}
