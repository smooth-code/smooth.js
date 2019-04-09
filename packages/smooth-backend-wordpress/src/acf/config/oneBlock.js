import allFields from './allFields'

export default function oneBlock(node, helpers, state) {
  const { gql: g, acf: a } = helpers

  const name = g.getName(node)
  const id = `${state.parentId}_blocks_${name}`
  const description = node.description ? node.description.value : null
  const fields = allFields(node, helpers, { ...state, parentId: id })

  if (description) {
    fields.unshift(
      a.field(`${id}__informations`, 'informations', {
        label: 'Informations',
        type: 'message',
        message: description,
      }),
    )
  }

  return a.layout(id, name, fields)
}
