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

export function formatTime(value) {
  if (typeof value !== 'string' || value === '') return null
  const [, hours, minutes, type] = value.match(/^(\d+):(\d+)\s+([ap]m)$/)
  return `${[
    type === 'pm' ? ((12 + Number(hours)) % 24).toString() : hours,
    minutes,
    '0',
  ]
    .map(x => x.padStart(2, '0'))
    .join(':')}Z`
}
