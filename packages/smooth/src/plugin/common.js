/* eslint-disable no-restricted-syntax, no-await-in-loop */

export function hasHook(plugin, hook) {
  return Boolean(plugin.plugin[hook])
}

export function runHook(plugin, hook, args) {
  return plugin.plugin[hook](args, plugin.options)
}

export async function runAsyncHook(plugin, hook, args) {
  return plugin.plugin[hook](args, plugin.options)
}

export const createApplyHook = (plugins, defaultArgs = {}) => (
  hook,
  args,
  resultKey,
) => {
  let result = resultKey ? args[resultKey] : undefined
  for (const plugin of plugins) {
    if (hasHook(plugin, hook)) {
      result = runHook(
        plugin,
        hook,
        resultKey
          ? { ...args, ...defaultArgs, [resultKey]: result }
          : { ...args, ...defaultArgs },
      )
    }
  }
  if (!resultKey) return undefined
  return result
}

export const createApplyAsyncHook = (plugins, defaultArgs = {}) => async (
  hook,
  args,
  resultKey,
) => {
  let result = resultKey ? args[resultKey] : undefined
  for (const plugin of plugins) {
    if (hasHook(plugin, hook)) {
      result = await runAsyncHook(
        plugin,
        hook,
        resultKey
          ? { ...args, ...defaultArgs, [resultKey]: result }
          : { ...args, ...defaultArgs },
      )
    }
  }
  if (!resultKey) return undefined
  return result
}
