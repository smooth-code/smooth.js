import { applyHook } from '../node'

export const onCreateWebpackConfig = config => ({
  webpackConfig: defaultWebpackConfig,
  stage,
}) => {
  const webpackConfig = defaultWebpackConfig

  const actions = {
    setWebpackConfig(config) {
      if (config.plugins) {
        config.plugins.forEach(plugin => webpackConfig.plugins.push(plugin))
      }
      if (config.module && config.module.rules) {
        config.module.rules.forEach(rule =>
          webpackConfig.module.rules.push(rule),
        )
      }
    },
  }

  applyHook(config, 'onCreateWebpackConfig', {
    getConfig() {
      return webpackConfig
    },
    stage,
    actions,
  })

  return webpackConfig
}
