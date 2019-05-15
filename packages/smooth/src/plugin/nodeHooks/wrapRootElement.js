import { applyHook } from '../node'

export const wrapRootElement = config => ({ element, pathname }) =>
  applyHook(config, 'wrapRootElement', { element, pathname }, 'element')
