/* eslint-disable no-restricted-syntax */
import plugins from '__smooth_plugins'

export function runHook(plugin, hook, args) {
  return plugin[hook](args)
}

export function hasHook(plugin, hook) {
  return plugin[hook]
}

export function applyHook(hook, args, resultKey) {
  let result = args[resultKey]
  for (const plugin of plugins) {
    if (hasHook(plugin, hook)) {
      // eslint-disable-next-line no-await-in-loop
      result = runHook(plugin, hook, { ...args, [resultKey]: result })
    }
  }
  return result
}
