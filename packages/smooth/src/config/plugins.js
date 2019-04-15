import path from 'path'
import babelRequire from '../babel/require'

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
    return babelRequire(path.join(plugin.resolve, name))
  } catch (error) {
    return null
  }
}

export function parsePlugins(plugins) {
  return plugins.map(plugin => {
    if (typeof plugin === 'string') {
      plugin = { resolve: plugin }
    }
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const node = hasFile(plugin, 'smooth-node')
    const browser = hasFile(plugin, 'smooth-browser')
    const nodePlugin = loadFile(plugin, 'smooth-node')
    const options = plugin.options || {}
    return {
      node,
      plugin: nodePlugin,
      browser,
      resolve: plugin.resolve,
      options:
        nodePlugin && nodePlugin.resolveOptions
          ? nodePlugin.resolveOptions(options)
          : options,
    }
  })
}
