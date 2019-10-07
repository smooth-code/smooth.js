import gql from 'graphql-tag'
import camelcase from 'camelcase'
import * as t from '../types'

function getQueries(contentDefinitions) {
  return contentDefinitions.map(def => {
    const name = t.getName(def)
    const queryName = camelcase(name)
    return `${queryName}(slug: String!): ${name}`
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

export function addContentTypeDefinitions(schemaDefinition) {
  const { typeDefs } = schemaDefinition
  const contentDefinitions = typeDefs.definitions.filter(
    type =>
      t.isObjectTypeDefinition(type) &&
      t.hasDirective(type, directive =>
        t.isName(directive.name, { value: 'content' }),
      ),
  )

  contentDefinitions.forEach(type => type.fields.push(metadataField))

  const {
    definitions: [queryDefinition],
  } = gql`
    type Query {
      ping: Boolean
      ${getQueries(contentDefinitions).join('\n')}
    }
  `

  typeDefs.definitions.push(queryDefinition)

  return schemaDefinition
}
