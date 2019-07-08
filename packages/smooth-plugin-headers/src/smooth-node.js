/* eslint-disable import/no-extraneous-dependencies */
import pathToRegexp from 'path-to-regexp'

export function parseHeaders(url = '', headers = {}) {
  return [
    ...Object.entries(headers)
      .reduce((acc, [rule, values = []]) => {
        if (pathToRegexp(rule).test(url)) {
          values.forEach(header => {
            const [, key, value] = /^([^:]*)\s*:\s*(.*)$/.exec(header)
            acc.set(key, value)
          })
        }
        return acc
      }, new Map())
      .entries(),
  ]
}

export function onCreateServer({ app }, { headers = {} }) {
  app.use(({ url }, res, next) => {
    parseHeaders(url, headers).forEach(args => res.set(...args))
    next()
  })
}
