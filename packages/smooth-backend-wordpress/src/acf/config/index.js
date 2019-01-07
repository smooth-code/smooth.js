import oneBlock from './oneBlock'
import oneModel from './oneModel'
import { indexByKey } from './util'

export function generateConfig(ast, helpers) {
  const state = { ast }
  const layouts = ast.definitions
    .map(def => oneBlock(def, helpers, state))
    .filter(x => x)

  state.blockLayouts = indexByKey(layouts)

  const modelFieldGroups = ast.definitions
    .map(def => oneModel(def, helpers, state))
    .filter(x => x)

  return modelFieldGroups
}
