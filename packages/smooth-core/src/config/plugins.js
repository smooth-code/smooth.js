export function parsePlugins(plugins) {
  return plugins.map(plugin => ({
    // eslint-disable-next-line global-require, import/no-dynamic-require
    hooks: require(plugin.resolve),
    options: plugin.options,
  }))
}
