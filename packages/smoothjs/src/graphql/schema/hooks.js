import * as types from '../types'

export async function applyAsyncHook(plugins, hook, value) {
  for (const plugin of plugins) {
    if (plugin[hook]) {
      // eslint-disable-next-line no-await-in-loop
      await plugin[hook](value, { types })
    }
  }
  return value
}
