import { toRelativeUrl, formatDate, formatDateTime } from './util'

function acfField(object, name) {
  if (object.acf) {
    return object.acf[name] || null
  }

  return object[name] || null
}

const handlers = {
  date({ name, list }) {
    if (list) return null
    return object => formatDate(acfField(object, name))
  },
  dateTime({ name, list }) {
    if (list) return null
    return object => formatDateTime(acfField(object, name))
  },
  link({ name, list }, helpers, state) {
    const { homeUrl } = state.options
    if (list) return null
    return object => {
      const link = acfField(object, name)
      if (!link) return null
      return {
        ...link,
        url: toRelativeUrl(homeUrl, link.url),
      }
    }
  },
  shortText({ name, list }) {
    if (!list) return null
    return object => {
      const value = acfField(object, name)
      return value ? value.split(',') : null
    }
  },
  longText({ name, list }) {
    if (!list) return null
    return object => {
      const value = acfField(object, name)
      return value ? value.split('\n') : null
    }
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
  if (!infos) {
    return null
  }
  const defaultResolver = {
    [name]: object => acfField(object, name),
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
  const typeDef = t.findTypeDefinition(node.type, state.ast)
  if (!typeDef) {
    return {}
  }
  const type = t.getContentSlug(typeDef)
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

  if (t.isObjectTypeDefinition(node)) {
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
