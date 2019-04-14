/* eslint-disable no-restricted-syntax */
import plugins from '__smooth_plugins'
import { createApplyHook } from './common'

export { hasHook, runHook } from './common'

export const applyHook = createApplyHook(plugins)
