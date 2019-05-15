import { applyHook } from '../node'

export const onCreateBabelConfig = config => ({ isServer }) => {
  let babelOptions = { plugins: [], presets: [] }

  const actions = {
    setBabelOptions(opts) {
      babelOptions = { ...opts, ...opts }
    },
    setBabelPlugin({ name, options = {} }) {
      babelOptions = {
        ...babelOptions,
        plugins: [...babelOptions.plugins, [name, options]],
      }
    },
    setBabelPreset({ name, options = {} }) {
      babelOptions = {
        ...babelOptions,
        presets: [...babelOptions.presets, [name, options]],
      }
    },
  }

  applyHook(config, 'onCreateBabelConfig', { isServer, actions })

  return babelOptions
}
