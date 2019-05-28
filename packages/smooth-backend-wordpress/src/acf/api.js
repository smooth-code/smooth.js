import fs from 'fs'
import axios from 'axios'
import qs from 'qs'
import path from 'path'
import mime from 'mime-types'
import pLimit from 'p-limit'

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

function formatContent(content) {
  return {
    id: content.id,
    title: content.title,
    fields: content.acf,
    url: content.source_url,
  }
}

export function createClient({
  baseUrl,
  concurrency,
  password,
  user,
  defaultLanguage,
}) {
  const limit = pLimit(concurrency)
  const token = Buffer.from(`${user}:${password}`).toString('base64')
  const headers = { Authorization: `Basic ${token}` }

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

    async getContent(request) {
      const { data } = await this.getContents(request)
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

    async create({ type, data }) {
      const url = `${baseUrl}/wp-json/wp/v2/${type}`

      if (type === 'media') {
        const mediaPath = data
        const filename = path.basename(mediaPath)
        const { data: content } = await axios.post(url, fs.readFileSync(data), {
          headers: {
            'cache-control': 'no-cache',
            'Content-Disposition': `attachment; filename=${filename}`,
            'Content-Type': mime.contentType(filename),
            ...headers,
          },
        })
        return formatContent(content)
      }

      const { data: content } = await axios.post(url, data, { headers })
      return formatContent(content)
    },

    async createMany({ type, data }) {
      return Promise.all(
        data.map(d => limit(() => this.create({ type, data: d }))),
      )
    },

    async truncate({ type }) {
      const { data: results } = await axios.get(
        `${baseUrl}/wp-json/wp/v2/${type}`,
        {
          params: { per_page: 100 },
        },
      )

      return Promise.all(
        results.map(async ({ id }) =>
          limit(() =>
            axios.delete(`${baseUrl}/wp-json/wp/v2/${type}/${id}`, {
              headers,
              params: { force: 1 },
            }),
          ),
        ),
      )
    },
  }
}
