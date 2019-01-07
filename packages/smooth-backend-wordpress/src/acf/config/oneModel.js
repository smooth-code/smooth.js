import allFields from './allFields'

export default function oneBlock(node, helpers, state) {
  const { gql: g, acf: a } = helpers
  if (!g.isObjectTypeDefinition(node)) return null

  const modelNode = g.getDirective(node, 'model')
  if (!modelNode) return null

  const name = g.getName(node)
  const slug = g.getModelSlug(node)

  return a.fieldGroup(
    name,
    allFields(node, helpers, { ...state, parentId: `models_${name}` }),
    a.fieldGroupLocation(slug),
  )
}
