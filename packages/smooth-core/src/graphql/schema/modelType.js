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

const {
  definitions: [
    {
      fields: [metadataField],
    },
  ],
} = gql`
  type Foo {
    metadata: Metadata!
  }
`

export function addModelTypeDefinitions(schemaDefinition) {
  const { typeDefs } = schemaDefinition
  const modelDefinitions = typeDefs.definitions.filter(
    type =>
      t.isObjectTypeDefinition(type) &&
      t.hasDirective(type, directive =>
        t.isName(directive.name, { value: 'model' }),
      ),
  )

  modelDefinitions.forEach(type => type.fields.push(metadataField))

  const {
    definitions: [queryDefinition],
  } = gql`
    type Query {
      ping: Boolean
      ${getQueries(modelDefinitions).join('\n')}
    }
  `

  typeDefs.definitions.push(queryDefinition)

  return schemaDefinition
}
