import axios from 'axios'
import qs from 'qs'

function getParams({ lang, type, query }) {
  const params = {}
  if (lang) params.lang = lang
  if (type) params.type = type
  if (query) Object.assign(params, query)
  return params
}

function paramsSerializer(params) {
  return qs.stringify(params, { arrayFormat: 'indices' })
}

export function createClient({ baseUrl, defaultLanguage }) {
  return {
    async getContents({ type, slug, lang, query }) {
      type = type.toLowerCase()
      const params = getParams({ lang: lang || defaultLanguage, type, query })

      if (slug) {
        params.slug = slug
        const { data } = await axios.get(
          `${baseUrl}/wp-json/presspack/v1/content/`,
          { params },
        )
        if (data && data.status !== 'publish') return []
        return data
          ? { totalCount: 1, data: [data] }
          : { totalCount: 0, data: [] }
      }

      const { data, headers } = await axios.get(
        `${baseUrl}/wp-json/presspack/v1/contents/`,
        { params, paramsSerializer },
      )
      return {
        totalCount: Number(headers['x-wp-total']),
        data,
      }
    },
    async getContent(options) {
      const { data } = await this.getContents(options)
      return data[0] || null
    },
    async getContentPreview({ lang, id }) {
      const params = getParams({ lang: lang || defaultLanguage })
      const { data } = await axios.get(
        `${baseUrl}/wp-json/presspack/v1/preview/${id}/`,
        { params },
      )
      return data
    },
  }
}
