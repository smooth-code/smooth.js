import path from 'path'

function hasFile(plugin, name) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require.resolve(path.join(plugin.resolve, name))
    return true
  } catch (error) {
    return false
  }
}

function loadFile(plugin, name) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(path.join(plugin.resolve, name))
  } catch (error) {
    return null
  }
}

export function parsePlugins(plugins) {
  return plugins.map(plugin => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const node = loadFile(plugin, 'smooth-node')
    const browser = hasFile(plugin, 'smooth-browser')
    const options = plugin.options || {}
    return {
      node,
      browser,
      resolve: plugin.resolve,
      options:
        node && node.resolveOptions ? node.resolveOptions(options) : options,
    }
  })
}
