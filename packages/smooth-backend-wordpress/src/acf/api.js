import axios from 'axios'

function getParams({ lang, type }) {
  const params = {}
  if (lang) params.lang = lang
  if (type) params.type = type
  return params
}

export function createClient(baseUrl) {
  return {
    async getContents({ type, slug, lang }) {
      type = type.toLowerCase()
      const params = getParams({ lang, type })

      if (slug) {
        params.slug = slug
        const { data } = await axios.get(
          `${baseUrl}/wp-json/presspack/v1/content/`,
          { params },
        )
        return data ? [data] : []
      }

      const { data } = await axios.get(
        `${baseUrl}/wp-json/presspack/v1/contents/`,
        { params },
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
      return data ? data.acf : null
    },
  }
}
