import createDefaultResolvers from './createDefaultResolvers'
import { createClient } from '../api'

function getBlockPropsResolvers(blockDefinitions) {
  return blockDefinitions.reduce((resolvers, def) => {
    const name = def.name.value
    resolvers[`${name}_props`] = object => {
      if (object.acf_fc_layout === name) return { acf: object }
      return null
    }
    return resolvers
  }, {})
}

const imageSizeResolver = name => object => ({
  url: object.sizes[name],
  width: object.sizes[`${name}-width`],
  height: object.sizes[`${name}-height`],
})

export function createResolvers(
  { types: t, schemaDefinition, config },
  options,
) {
  const apiClient = createClient(options)
  const { typeDefs } = schemaDefinition
  const blockDefinitions = typeDefs.definitions.filter(
    typeDefinition =>
      t.isObjectTypeDefinition(typeDefinition) &&
      t.hasDirective(typeDefinition, directive =>
        t.isName(directive.name, { value: 'block' }),
      ),
  )

  return {
    ...createDefaultResolvers(
      schemaDefinition,
      { types: t },
      { apiClient, config, options },
    ),
    Block: {
      type(object) {
        return object.acf_fc_layout
      },
      ...getBlockPropsResolvers(blockDefinitions),
    },
    Image: {
      mimeType(object) {
        return object.mime_type
      },
      thumbnail: imageSizeResolver('thumbnail'),
      medium: imageSizeResolver('medium'),
      large: imageSizeResolver('large'),
    },
  }
}
