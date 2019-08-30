import { applyHook } from '../node'

export const wrapRootElement = config => ({ element, pathname, requestId }) =>
  applyHook(
    config,
    'wrapRootElement',
    { element, pathname, requestId },
    'element',
  )
