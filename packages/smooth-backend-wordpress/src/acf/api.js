import axios from 'axios'
import qs from 'qs'

function getParams({ lang, type, filter }) {
  const params = {}
  if (lang) params.lang = lang
  if (type) params.type = type
  if (filter) params.filter = filter
  return params
}

function paramsSerializer(params) {
  return qs.stringify(params, { arrayFormat: 'brackets' })
}

export function createClient(baseUrl) {
  return {
    async getContents({ type, slug, lang, filter }) {
      type = type.toLowerCase()
      const params = getParams({ lang, type, filter })

      if (slug) {
        params.slug = slug
        const { data } = await axios.get(
          `${baseUrl}/wp-json/presspack/v1/content/`,
          { params },
        )
        if (data && data.status !== 'publish') return []
        return data ? [data] : []
      }

      const { data } = await axios.get(
        `${baseUrl}/wp-json/presspack/v1/contents/`,
        { params, paramsSerializer },
      )
      return data
    },
    async getContent(options) {
      const results = await this.getContents(options)
      return results[0] || null
    },
    async getContentPreview({ lang, id }) {
      const params = getParams({ lang })
      const { data } = await axios.get(
        `${baseUrl}/wp-json/presspack/v1/preview/${id}/`,
        { params },
      )
      return data
    },
  }
}
