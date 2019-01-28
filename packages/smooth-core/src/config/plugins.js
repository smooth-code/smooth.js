export function parsePlugins(plugins) {
  return plugins.map(plugin => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const hooks = require(plugin.resolve)
    return {
      hooks,
      options: hooks.resolveOptions
        ? hooks.resolveOptions(plugin.options)
        : plugin.options,
    }
  })
}
