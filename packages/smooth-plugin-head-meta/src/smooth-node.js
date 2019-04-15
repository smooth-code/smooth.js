import gql from 'graphql-tag'
import { typeDefs as headMetaTypeDefs } from './definitions/HeadMeta'

const {
  definitions: [
    {
      fields: [headMetaField],
    },
  ],
} = gql`
  type Content {
    headMeta: HeadMeta @field
  }
`

function one(node, { types: t, options }) {
  if (!t.isObjectTypeDefinition(node)) return
  if (
    !t.hasDirective(node, directive =>
      t.isName(directive.name, { value: 'content' }),
    )
  )
    return
  if (options.whitelist && !options.whitelist.includes(node.name.value)) return
  node.fields.push(headMetaField)
}

export function onCreateSchemaDefinition({ schemaDefinition, types }, options) {
  schemaDefinition.typeDefs.definitions.forEach(node =>
    one(node, { types, options }),
  )
  schemaDefinition.typeDefs.definitions = [
    ...schemaDefinition.typeDefs.definitions,
    ...headMetaTypeDefs.definitions,
  ]
}
