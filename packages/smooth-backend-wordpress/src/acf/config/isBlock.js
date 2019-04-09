export default function isBlock(node, helpers) {
  const { gql: g } = helpers
  if (!g.isObjectTypeDefinition(node)) return false
  if (!g.getDirective(node, 'block')) return false
  return true
}
