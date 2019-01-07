import one from './one'

export function generateConfig(ast, helpers) {
  return ast.definitions.map(def => one(def, helpers)).filter(x => x)
}
