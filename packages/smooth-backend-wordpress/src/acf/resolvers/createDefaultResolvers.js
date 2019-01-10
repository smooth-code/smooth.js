const handlers = {
  shortText({ name, list }) {
    if (!list) return null
    return object => (object.acf[name] ? object.acf[name].split('\n') : null)
  },
  longText({ name, list }) {
    if (!list) return null
    return object => (object.acf[name] ? object.acf[name].split('\n') : null)
  },
}

function getFieldResolver(node, helpers, state) {
  const { types: t } = helpers
  const name = t.getName(node)
  if (name === 'metadata') {
    return {
      [name]: object => ({
        id: object.id || object.ID,
        slug: object.slug || object.post_name,
      }),
    }
  }
  const infos = t.getFieldInfos(node, state.ast)
  if (!infos) return null
  const defaultResolver = {
    [name]: object => object.acf[name] || null,
  }
  const handler = handlers[infos.type.name]
  if (!handler) return defaultResolver
  const fn = handler(infos, helpers, state)
  if (!fn) return defaultResolver
  return {
    [name]: fn,
  }
}

function getFieldResolvers(nodes, helpers, state) {
  return nodes.reduce(
    (resolvers, node) => ({
      ...resolvers,
      ...getFieldResolver(node, helpers, state),
    }),
    {},
  )
}

function getQueryFieldResolver(node, helpers, state) {
  const { types: t } = helpers
  const name = t.getName(node)
  const type = t.getName(node.type)
  return {
    async [name](object, { slug, lang, id, preview }) {
      if (preview) {
        return state.apiClient.getContentPreview({
          type,
          lang,
          id,
        })
      }

      return state.apiClient.getContent({ type, lang, slug })
    },
  }
}

function getQueryFieldResolvers(nodes, helpers, state) {
  return nodes.reduce(
    (resolvers, node) => ({
      ...resolvers,
      ...getQueryFieldResolver(node, helpers, state),
    }),
    {},
  )
}

function one(node, helpers, state) {
  const { types: t } = helpers

  if (t.isObjectTypeDefinition(node) && t.getName(node) === 'Query') {
    return {
      Query: getQueryFieldResolvers(node.fields, helpers, state),
    }
  }

  if (t.isUnionTypeDefinition(node)) {
    const name = t.getName(node)
    return {
      [name]: {
        __resolveType(object) {
          return object.acf_fc_layout
        },
      },
    }
  }

  if (
    t.isObjectTypeDefinition(node) &&
    (t.getDirective(node, 'model') || t.getDirective(node, 'block'))
  ) {
    const name = t.getName(node)
    return {
      [name]: getFieldResolvers(node.fields, helpers, state),
    }
  }

  return null
}

export default function createDefaultResolvers(
  schemaDefinition,
  helpers,
  state,
) {
  return schemaDefinition.typeDefs.definitions.reduce(
    (resolvers, def) => ({
      ...resolvers,
      ...one(def, helpers, { ...state, ast: schemaDefinition.typeDefs }),
    }),
    {},
  )
}
