import gql from 'graphql-tag'
import camelcase from 'camelcase'
import * as t from '../types'

function getQueries(modelDefinitions) {
  return modelDefinitions.map(def => {
    const name = t.getName(def)
    const queryName = camelcase(name)
    return `${queryName}(slug: String!, lang: String, id: String, preview: Boolean): ${name}`
  })
}

export function addModelTypeDefinitions(schemaDefinition) {
  const { typeDefs } = schemaDefinition
  const modelDefinitions = typeDefs.definitions.filter(
    typeDefinition =>
      t.isObjectTypeDefinition(typeDefinition) &&
      t.hasDirective(typeDefinition, directive =>
        t.isName(directive.name, { value: 'model' }),
      ),
  )

  const {
    definitions: [modelDefinition],
  } = gql`
    type Query {
      ping: Boolean
      ${getQueries(modelDefinitions).join('\n')}
    }
  `

  typeDefs.definitions.push(modelDefinition)

  return schemaDefinition
}
