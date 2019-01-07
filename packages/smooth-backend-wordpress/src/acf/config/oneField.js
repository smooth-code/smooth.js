import { singularize, humanize } from 'smooth-core/utils'
import allFields from './allFields'
import { indexByKey } from './util'

function enumValuesToChoices(nodes, helpers) {
  const { gql: g } = helpers
  return nodes.reduce((choices, node) => {
    const name = g.getName(node)
    choices[name] = name
    return choices
  }, {})
}

function err(infos, message) {
  return new Error(`ACF error: field ${infos.name}: ${message}`)
}

function preventList(infos) {
  if (infos.list) {
    throw err(infos, `list not supported with "${infos.type.name}" type`)
  }
}

const handlers = {
  boolean(infos) {
    preventList(infos)
    return { type: 'true_false' }
  },
  integer(infos) {
    preventList(infos)
    return { type: 'number' }
  },
  float(infos) {
    preventList(infos)
    return { type: 'number' }
  },
  date(infos) {
    preventList(infos)
    return { type: 'date_picker' }
  },
  dateTime(infos) {
    preventList(infos)
    return { type: 'date_time_picker' }
  },
  shortText({ list }) {
    if (list) return { type: 'textarea' }
    return { type: 'text' }
  },
  longText({ list }) {
    if (list) return { type: 'textarea' }
    return { type: 'textarea' }
  },
  richText(infos) {
    preventList(infos)
    return { type: 'wysiwyg', toolbar: 'basic', media_upload: 0 }
  },
  image({ list }) {
    if (list) return { type: 'gallery' }
    return { type: 'image' }
  },
  link(infos) {
    preventList(infos)
    return { type: 'link' }
  },
  enum(
    {
      required,
      list,
      type: { typeDefinitionNode },
    },
    helpers,
  ) {
    return {
      type: 'select',
      multiple: Number(list),
      allow_null: Number(!required),
      choices: enumValuesToChoices(typeDefinitionNode.values, helpers),
    }
  },
  relation({ list, type: { model } }) {
    if (list) {
      return {
        type: 'relationship',
        filters: ['search'],
        post_type: [model],
      }
    }
    return {
      type: 'post_object',
      post_type: [model],
    }
  },
  object(
    {
      label,
      list,
      type: { typeDefinitionNode },
    },
    helpers,
    state,
  ) {
    return {
      type: list ? 'repeater' : 'group',
      button_label: list ? humanize(`Add ${singularize(label)}`) : null,
      sub_fields: allFields(typeDefinitionNode, helpers, state),
    }
  },
  block({ list, name }, helpers, state) {
    if (!list) {
      throw err(
        { name },
        'single not supported with "block" type, please use []',
      )
    }

    return {
      type: 'flexible_content',
      button_label: 'Add block',
      layouts: state.blockLayouts,
    }
  },
  union({ list, name, type }, helpers, state) {
    if (!list) {
      throw err(
        { name },
        'single not supported with "union" type, please use []',
      )
    }
    const { acf: a, gql: g } = helpers
    const layouts = type.types.map(subType => {
      const subName = g.getName(subType.typeDefinitionNode)
      const label = humanize(name)
      const id = `${state.parentId}_${name}`
      return a.layout(
        id,
        subName,
        allFields(subType.typeDefinitionNode, helpers, {
          ...state,
          parentId: id,
        }),
        { label },
      )
    })

    return {
      type: 'flexible_content',
      layouts: indexByKey(layouts),
    }
  },
}

export default function oneField(node, helpers, state) {
  const { acf: a, gql: g } = helpers
  const infos = g.getFieldInfos(node, state.ast)
  if (!infos) return null
  const id = `${state.parentId}_${infos.name}`
  const handler = handlers[infos.type.name]
  if (!handler) {
    throw new Error(`Type ${infos.type.name} not implemented by ACF`)
  }
  const options = handler(infos, helpers, { ...state, parentId: id })
  return a.field(id, infos.name, {
    label: infos.label,
    instructions: infos.description,
    required: Number(infos.required),
    ...options,
  })
}
