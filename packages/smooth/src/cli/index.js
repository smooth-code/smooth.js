/* eslint-disable no-console */
import path from 'path'
import program from 'commander'
import createLogger from 'progress-estimator'
import { getConfig } from '../config'
import { start } from '../server'
import {
  buildBrowser,
  watchSchema,
  buildSchema,
  watchWebpack,
  buildSchemaDefinition,
  buildWebpack,
} from '../build'
import babelRequire from '../babel/require'
import { createAPIClient } from '../api'
import processSeeds from '../seeds/process'

const logger = createLogger()

function watch({ config }) {
  let webpackWatcher

  const schemaWatcher = watchSchema({
    config,
    logger: promise => logger(promise, 'Build schemas'),
  })

  schemaWatcher.on('done', ({ schema, fragmentTypes }) => {
    if (!webpackWatcher) {
      webpackWatcher = watchWebpack({
        config,
        logger: promise => logger(promise, 'Build webpack'),
      })

      webpackWatcher.once('done', () => {
        console.log('🚀 Ready on http://localhost:3000')
      })

      // eslint-disable-next-line no-console
      webpackWatcher.on('error', console.error)
    }

    start({
      dev: true,
      schema,
      fragmentTypes,
      config,
      webpackMiddleware: webpackWatcher.middleware,
    })
  })

  // eslint-disable-next-line no-console
  schemaWatcher.on('error', console.error)
}

function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H',
  )
}

async function devCommand() {
  clearConsole()
  console.log('> smooth.js 👨‍🚀')
  const config = await getConfig({ dev: true })
  await logger(buildBrowser({ config }), 'Setup project')
  watch({ config })
}

async function logBuild(operation, name) {
  console.log(`Building ${name}`)
  const timeKey = `Build ${name}`
  console.time(timeKey)
  await operation()
  console.timeEnd(timeKey)
}

async function buildCommand() {
  const config = await getConfig({ dev: false })
  await logBuild(() => buildBrowser({ config }), 'plugins')
  await logBuild(() => buildSchema({ config }), 'schema')
  await logBuild(() => buildWebpack({ config }), 'webpack')
  // eslint-disable-next-line no-console
  console.log('Built!')
}

async function startCommand() {
  const config = await getConfig({ dev: false })
  const { schema } = await buildSchemaDefinition({ config })
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const fragmentTypes = require(path.join(
    config.cachePath,
    'fragmentTypes.json',
  ))
  start({
    dev: false,
    schema,
    fragmentTypes,
    config,
  })
  console.log('Started 🚀')
}

async function seedCommand() {
  const config = await getConfig({ dev: false })
  const api = createAPIClient({ config })
  await processSeeds({
    api,
    config,
    createSeeds: babelRequire(config.seedsPath).default,
    logger,
  })
  console.log('Seeded 🍙')
}

function runCmd(command) {
  command().catch(error => {
    // eslint-disable-next-line no-console
    console.error(error)
  })
}

program
  .command('dev')
  .description(
    'Starts the application in development mode (hot-code reloading, error reporting, etc)',
  )
  .action(() => runCmd(devCommand))
program
  .command('build')
  .description('Compiles the application for production deployment')
  .action(() => runCmd(buildCommand))
program
  .command('start')
  .description(
    'Starts the application in production mode.\nThe application should be compiled with `smooth build` first.',
  )
  .action(() => runCmd(startCommand))
program
  .command('seed')
  .description('Seeds the application using ./seeds directory.')
  .action(() => runCmd(seedCommand))

program.parse(process.argv)
