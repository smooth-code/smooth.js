import camelcase from 'camelcase'
import { indexBy } from '../utils'
import babelRequire from '../babel/require'

export function collectFromArgs({ type, getData, transformMocks = x => x }) {
  return {
    getData: ({ options }) => Promise.resolve({ type, data: getData(options) }),
    getMocks: options => ({
      type,
      data: transformMocks(getData(options)),
    }),
  }
}

export function collectFromFolder({ node, transformMocks = x => x, webpack }) {
  return {
    async getData({ glob, options }) {
      const files = await node({ glob })
      const data = files.map(file => ({
        name: file.replace(/^\.\/(.+)\..*$/, '$1'),
        // eslint-disable-next-line global-require, import/no-dynamic-require
        data: babelRequire(file).default(options),
      }))
      return { type: 'pages', data }
    },
    getMocks(options) {
      const context = webpack()
      return {
        type: 'pages',
        data: transformMocks(
          context.keys().map(file => ({
            name: file.replace(/^\.\/(.+)\..*$/, '$1'),
            data: context(file).default(options).fields,
          })),
        ),
      }
    },
  }
}

export function collectFromMedia({ node, transformMocks = x => x, webpack }) {
  return {
    async getData({ glob }) {
      const data = await node({ glob })
      return { type: 'media', data: data.map(d => ({ data: d })) }
    },
    getMocks() {
      const context = webpack('./contents', false)
      return {
        type: 'media',
        data: transformMocks(
          context.keys().map(file => ({
            name: file.replace(/^\.\/(.+)\..*$/, '$1'),
            data: { url: file.replace(/^\./, '') },
          })),
        ),
      }
    },
  }
}

export function collect({ seeds = [] }) {
  return {
    async process({ glob, processor, ...options }) {
      /* eslint-disable no-restricted-syntax, no-await-in-loop */
      for (const seed of seeds) {
        const data = await seed.getData({ glob, options })
        const loadedData = await processor(data)
        options[camelcase(data.type)] = indexBy(
          (x, i) => (data.type === 'media' ? x.title.raw : data.data[i].name),
          loadedData,
          ({ id }) => id,
        )
      }
      /* eslint-enable no-restricted-syntax, no-await-in-loop */
    },
    getMocks() {
      return seeds.reduce((result, { getMocks }) => {
        const { type, data: mocks } = getMocks(result)
        return {
          ...result,
          [camelcase(type)]: Array.isArray(mocks)
            ? indexBy(x => x.name, mocks, ({ data }) => data)
            : { main: mocks },
        }
      }, {})
    },
  }
}
