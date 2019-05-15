import { applyHook } from '../browser'

export const onRouteUpdate = options => applyHook('onRouteUpdate', options)
