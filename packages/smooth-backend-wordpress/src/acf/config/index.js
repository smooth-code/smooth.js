import oneBlock from './oneBlock'
import oneContent from './oneContent'

export function generateConfig(ast, helpers) {
  const state = { ast }
  const layouts = ast.definitions
    .map(def => oneBlock(def, helpers, state))
    .filter(x => x)

  state.blockLayouts = layouts

  const contentFieldGroups = ast.definitions
    .map(def => oneContent(def, helpers, state))
    .filter(x => x)

  return contentFieldGroups
}
