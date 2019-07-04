export const i18nRootPath = '/:lang(.{2})?'
const LANG_REGEXP = new RegExp(`^/.{2}(/.*)`)

function locationToString(location) {
  if (typeof location === 'string') return location
  const { pathname = '', search = '', hash = '' } = location
  return `${pathname}${search}${hash}`
}

export function formatLangUrl(location, lang) {
  const url = locationToString(location)
  const matches = url.match(LANG_REGEXP)
  const prefix = lang ? `/${lang}` : ''
  if (!matches) return `${prefix}${url}`
  return `${prefix}${matches[1]}`
}
