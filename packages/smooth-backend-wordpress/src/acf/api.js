import axios from 'axios'

function getParams({ lang }) {
  const params = {}
  if (lang) {
    params.lang = lang
  }
  return params
}

export function createClient(baseUrl) {
  return {
    async getContents({ type, slug, lang }) {
      type = type.toLowerCase()
      const params = getParams({ lang })

      if (slug) {
        params.type = type
        params.slug = slug
        const { data } = await axios.get(
          `${baseUrl}/wp-json/presspack/v1/content/`,
          { params },
        )
        return data ? [data] : []
      }

      const { data } = await axios.get(`${baseUrl}/wp-json/acf/v3/${type}`, {
        params,
      })
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
