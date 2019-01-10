import oneBlock from './oneBlock'
import oneModel from './oneModel'

export function generateConfig(ast, helpers) {
  const state = { ast }
  const layouts = ast.definitions
    .map(def => oneBlock(def, helpers, state))
    .filter(x => x)

  state.blockLayouts = layouts

  const modelFieldGroups = ast.definitions
    .map(def => oneModel(def, helpers, state))
    .filter(x => x)

  return modelFieldGroups
}
