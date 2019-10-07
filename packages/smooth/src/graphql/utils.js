import qs from 'query-string'
import { useLang } from '../i18n'
import { useLocation } from '../router'

export function useOperationHeaders({ pageContent = false } = {}) {
  const lang = useLang()
  const location = useLocation()
  const headers = {}

  if (lang) {
    headers['x-smooth-lang'] = lang
  }

  if (pageContent) {
    const { id, preview } = qs.parse(location.search)
    if (preview) {
      headers['x-smooth-preview-id'] = id
      headers['x-smooth-preview'] = 1
    }
  }

  return headers
}
