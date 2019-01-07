import oneBlock from './oneBlock'
import oneModel from './oneModel'
import { indexByKey } from './util'

export function generateConfig(ast, helpers) {
  const { acf: a } = helpers
  const state = { ast }
  const layouts = ast.definitions
    .map(def => oneBlock(def, helpers, state))
    .filter(x => x)

  state.blockLayouts = layouts
  const blockFieldGroup = a.fieldGroup(
    'Blocks',
    [
      a.field('blocks', 'blocks', {
        label: 'Blocks',
        button_label: 'Add block',
        type: 'flexible_content',
        layouts: indexByKey(layouts),
      }),
    ],
    a.fieldGroupLocation('page'),
  )

  const modelFieldGroups = ast.definitions
    .map(def => oneModel(def, helpers, state))
    .filter(x => x)

  return [blockFieldGroup, ...modelFieldGroups]
}
