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
  }
}
