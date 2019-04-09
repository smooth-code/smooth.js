import isBlock from './isBlock'
import oneContent from './oneContent'

export function generateConfig(ast, helpers) {
  const state = { ast }

  state.blockNodes = ast.definitions.filter(def => isBlock(def, helpers))

  const contentFieldGroups = ast.definitions
    .map(def => oneContent(def, helpers, state))
    .filter(x => x)

  return contentFieldGroups
}
