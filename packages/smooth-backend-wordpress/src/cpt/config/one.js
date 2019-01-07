import { humanize, pluralize } from 'smooth-core/utils'

export default function one(node, { gql: g, cpt: c }) {
  if (!g.isObjectTypeDefinition(node)) return null
  const directive = g.getDirective(node, 'model')
  if (!directive) return null
  if (g.getName(node) === 'Page') return null
  const label =
    g.getArgv(directive, 'label') || pluralize(humanize(g.getName(node)))
  const icon = g.getArgv(directive, 'icon')
  return c.postType(g.getModelSlug(node), label, icon)
}
