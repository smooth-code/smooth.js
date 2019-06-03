import { applyHook } from '../node'

export const createBackendPayload = config => ({ data, name, type }) =>
  applyHook(config, 'createBackendPayload', { data, name, type }, 'data')
