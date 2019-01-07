import { applyAsyncHook } from '../plugin'
import {
  createSchemaDefinition,
  makeExecutableSchema,
  getFragmentTypes,
} from '../graphql'
import { createCache } from './cache'
import { Watcher, watchFs } from './watcher'
import webpackMiddleware from './webpackMiddleware'

export async function buildSchema({ config }) {
  const cache = createCache({ config })
  const schemaDefinition = await createSchemaDefinition({ config })
  await applyAsyncHook(config, 'onBuild', { schemaDefinition })
  const schema = makeExecutableSchema(schemaDefinition)
  const fragmentTypes = await getFragmentTypes({ schema })
  cache.writeCacheFile('fragmentTypes.json', JSON.stringify(fragmentTypes))
  return { schema, fragmentTypes }
}

export function watchSchema({ logger, ...options }) {
  const watcher = new Watcher(async () =>
    logger(buildSchema(options), 'Schemas'),
  )
  watchFs(options.config.srcPath, () => watcher.tick())
  return watcher
}

async function buildWebpack({ config }) {
  const compiler = webpack(config.webpackConfig)
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve(stats)
      }
    })
  })
}

export function watchWebpack({ logger, config }) {
  const resolver = {
    done: result => {
      if (resolver.resolve) {
        resolver.resolve(result)
        resolver.resolve = null
      }
    },
    task: async () => {
      resolver.done()
      resolver.promise = new Promise(resolve => {
        resolver.resolve = resolve
      })
      return logger(resolver.promise, 'Webpack')
    },
  }

  const watcher = new Watcher(resolver.task)

  const middleware = webpackMiddleware({ config }, compiler => {
    compiler.hooks.done.tap('smooth', (compiler, stats) => {
      resolver.done(stats)
    })
    compiler.hooks.invalid.tap('smooth', () => watcher.tick())
    compiler.hooks.run.tap('smooth', () => watcher.tick())
    compiler.hooks.watchRun.tap('smooth', () => watcher.tick())
  })

  watcher.middleware = middleware

  return watcher
}

export async function build({ config, dev }) {
  const cache = createCache({ config })
  const options = { config, cache, dev }
  const [{ schema, fragmentTypes }] = await Promise.all(
    dev
      ? [buildSchema(options)]
      : [buildSchema(options), buildWebpack(options)],
  )
  return { schema, fragmentTypes }
}
