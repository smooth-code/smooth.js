const endBackslashRegExp = /\/+$/

export function toRelativeUrl(baseUrl, url) {
  const regexp = new RegExp(`^${baseUrl.replace(endBackslashRegExp, '')}`)
  const finalUrl = `${url.replace(regexp, '')}` || '/'
  if (finalUrl.startsWith(':')) return url
  return finalUrl
}

export function formatDate(value) {
  if (typeof value !== 'string' || value === '') return null
  return new Date(value)
}
