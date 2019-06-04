import { callApi } from '../plugin/node'

export function createAPIClient({ config, lang }) {
  const defaultOptions = { lang }
  return {
    async getContents(options) {
      return callApi(config.plugins, 'getContents', {
        ...defaultOptions,
        ...options,
      })
    },
    async getContent(options) {
      return callApi(config.plugins, 'getContent', {
        ...defaultOptions,
        ...options,
      })
    },
    async createMany(options) {
      return callApi(config.plugins, 'createMany', {
        ...defaultOptions,
        ...options,
      })
    },
    async truncate(options) {
      return callApi(config.plugins, 'truncate', {
        ...defaultOptions,
        ...options,
      })
    },
  }
}
