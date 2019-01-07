import oneField from './oneField'

export default function allFields(node, helpers, state) {
  return node.fields
    .map(fieldNode => oneField(fieldNode, helpers, state))
    .filter(x => x)
}
