import { applyHook } from '../node'

export const onCreateServer = config => ({ app }) =>
  applyHook(config, 'onCreateServer', { app })
