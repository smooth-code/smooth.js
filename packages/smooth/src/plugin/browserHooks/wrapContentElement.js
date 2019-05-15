import { applyHook } from '../browser'

export const wrapContentElement = ({ element, props }) =>
  applyHook('wrapContentElement', { element, props }, 'element')
