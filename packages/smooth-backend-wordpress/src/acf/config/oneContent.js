import allFields from './allFields'

export default function oneContent(node, helpers, state) {
  const { gql: g, acf: a } = helpers
  if (!g.isObjectTypeDefinition(node)) return null

  const contentNode = g.getDirective(node, 'content')
  if (!contentNode) return null

  const name = g.getName(node)
  const slug = g.getContentSlug(node)

  return a.fieldGroup(
    name,
    allFields(node, helpers, { ...state, parentId: `contents_${name}` }),
    a.fieldGroupLocation(slug),
  )
}
