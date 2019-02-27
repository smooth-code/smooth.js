import { humanize, pluralize } from 'smooth/utils'

export default function one(node, { gql: g, cpt: c }) {
  if (!g.isObjectTypeDefinition(node)) return null
  const directive = g.getDirective(node, 'content')
  if (!directive) return null
  if (g.getName(node) === 'Page') return null
  const label =
    g.getArgv(directive, 'label') || pluralize(humanize(g.getName(node)))
  const icon = g.getArgv(directive, 'icon')
  return c.postType(g.getContentSlug(node), label, icon)
}
