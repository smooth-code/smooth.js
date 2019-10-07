/* eslint-disable no-restricted-syntax */
import { types } from '../graphql-node'
import { createApplyHook, createApplyAsyncHook } from './common'

export { runHook, runAsyncHook, hasHook } from './common'

export function applyHook(config, ...args) {
  const defaultOptions = { config, types }
  return createApplyHook(config.plugins, defaultOptions)(...args)
}

export async function applyAsyncHook(config, ...args) {
  const defaultOptions = { config, types }
  return createApplyAsyncHook(config.plugins, defaultOptions)(...args)
}

export async function callApi(plugins, api, request) {
  for (const plugin of plugins) {
    if (plugin.plugin[api]) {
      return plugin.plugin[api]({ request }, plugin.options)
    }
  }

  return null
}
