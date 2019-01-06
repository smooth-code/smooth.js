import allFields from './allFields'

export default function oneBlock(node, helpers, state) {
  const { gql: g, acf: a } = helpers
  if (!g.isObjectTypeDefinition(node)) return null
  if (!g.getDirective(node, 'block')) return null

  const name = g.getName(node)
  const id = `blocks_${name}`
  return a.layout(
    id,
    name,
    allFields(node, helpers, { ...state, parentId: id }),
  )
}
