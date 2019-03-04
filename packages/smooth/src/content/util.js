function fileError(message, filePath) {
  return new Error(`${message} found in "${filePath}"`)
}

export function getFragment(mod, name, filePath) {
  const fragment = mod[name]
  if (!fragment) {
    throw fileError(`No export "${name}"`, filePath)
  }
  return fragment
}

export function getFragmentDefinition(docNode, filePath) {
  const definition = docNode.definitions.find(
    node =>
      node.kind === 'FragmentDefinition' &&
      node.typeCondition.kind === 'NamedType',
  )

  if (!definition) {
    throw fileError(`No matching fragment definition`, filePath)
  }

  return definition
}

export function getDefinitionType(fragmentDefinition) {
  return fragmentDefinition.typeCondition.name.value
}

export function getDefinitionName(fragmentDefinition) {
  return fragmentDefinition.name.value
}

export function getComponent(mod, filePath) {
  const component = mod.default

  if (!component) {
    throw fileError(`No default export`, filePath)
  }

  return component
}

export function getFragmentString(fragment) {
  return fragment.loc.source.body
}
