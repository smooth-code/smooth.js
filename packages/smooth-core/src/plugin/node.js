import { types } from '../graphql'
import * as validators from './validators'

export async function runAsyncHook(plugin, hook, value) {
  return plugin.node[hook]({ ...value, options: plugin.options })
}

export function hasHook(plugin, hook) {
  return plugin.node && plugin.node[hook]
}

export async function applyAsyncHook(config, hook, value) {
  const validate = validators[hook]

  if (!validate) {
    throw new Error(`Unknown hook "${hook}"`)
  }

  validate(value)

  for (const plugin of config.plugins) {
    if (hasHook(plugin, hook)) {
      // eslint-disable-next-line no-await-in-loop
      await runAsyncHook(plugin, hook, { ...value, config, types })
    }
  }
  return value
}

export async function callApi(plugins, api, request) {
  for (const plugin of plugins) {
    if (plugin.node[api]) {
      return plugin.node[api]({ request, options: plugin.options })
    }
  }

  return null
}
