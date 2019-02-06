const endBackslashRegExp = /\/+$/

export function toRelativeUrl(baseUrl, url) {
  const regexp = new RegExp(`^${baseUrl.replace(endBackslashRegExp, '')}`)
  const finalUrl = `${url.replace(regexp, '')}` || '/'
  if (finalUrl.startsWith(':')) return url
  return finalUrl
}

function formatDateString(value) {
  return value
    .split('/')
    .reverse()
    .join('-')
}

export function formatDate(value) {
  if (typeof value !== 'string' || value === '') return null
  return new Date(formatDateString(value))
}

export function formatDateTime(value) {
  if (typeof value !== 'string' || value === '') return null
  const [date, time, period] = value.split(' ')
  return new Date(`${formatDateString(date)} ${time} ${period} UTC`)
}
