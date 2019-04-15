import path from 'path'
import webpack from 'webpack'
import { applyAsyncHook } from '../plugin'
import {
  createSchemaDefinition,
  makeExecutableSchema,
  getFragmentTypes,
} from '../graphql'
import { createCache } from './cache'
import { Watcher, watchFs } from './watcher'
import webpackMiddleware from './webpackMiddleware'

function getPluginFileContent(config) {
  const definitions = config.plugins
    .filter(plugin => plugin.browser)
    .map((plugin, index) => {
      const file = path.join(plugin.resolve, 'smooth-browser')
      return `{ plugin: require('${file}'), options: ${JSON.stringify(
        plugin.options,
      )} }`
    })

  return `module.exports = [${definitions.join(',\n')}]`
}

export async function buildBrowser({ config }) {
  const cache = createCache({ config })
  // Create empty default-blocks directory
  await cache.createDirectory('default-blocks')
  // Write browser plugins
  await cache.writeCacheFile('browser-plugins.js', getPluginFileContent(config))
}

export async function buildSchemaDefinition({ config }) {
  const schemaDefinition = await createSchemaDefinition({ config })
  const schema = makeExecutableSchema(schemaDefinition)
  return { schemaDefinition, schema }
}

export async function buildSchema({ config }) {
  const cache = createCache({ config })
  const { schemaDefinition, schema } = await buildSchemaDefinition({ config })
  await applyAsyncHook(config, 'onBuild', { schemaDefinition })
  const fragmentTypes = await getFragmentTypes({ schema })
  await cache.writeCacheFile(
    'fragmentTypes.json',
    JSON.stringify(fragmentTypes),
  )
  return { schema, fragmentTypes }
}

export function watchSchema({ logger, ...options }) {
  const watcher = new Watcher(async () => logger(buildSchema(options)))
  watchFs(options.config.srcPath, () => watcher.tick())
  return watcher
}

export async function buildWebpack({ config }) {
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

export function watchWebpack({ config, logger }) {
  const resolver = {
    done: result => {
      if (resolver.resolve) {
        resolver.resolve(result)
        resolver.resolve = null
      }
    },
    task: async () => {
      if (resolver.resolve) return
      resolver.promise = new Promise(resolve => {
        resolver.resolve = resolve
      })
      return logger(resolver.promise)
    },
  }

  const watcher = new Watcher(resolver.task)
  watcher.tick()

  const middleware = webpackMiddleware({ config }, compiler => {
    compiler.hooks.done.tap('smooth', (compiler, stats) => {
      resolver.done(stats)
    })
    compiler.hooks.invalid.tap('smooth', (filename, changeTime) => {
      if (!filename.match(/\/\.smooth\//)) {
        watcher.tick()
      }
    })
  })

  watcher.middleware = middleware

  return watcher
}
