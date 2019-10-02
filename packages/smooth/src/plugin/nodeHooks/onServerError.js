import { applyHook } from '../node'

export const onServerError = config => ({ error, req }) =>
  applyHook(config, 'onServerError', { error, req })
