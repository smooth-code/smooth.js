import { applyAsyncHook } from '../node'

export const onBuild = config => ({ schemaDefinition }) =>
  applyAsyncHook(config, 'onBuild', { schemaDefinition })
