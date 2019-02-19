/* eslint-disable no-console */
import path from 'path'
import program from 'commander'
import createLogger from 'progress-estimator'
import { getConfig } from '../config'
import { start } from '../server'
import {
  buildBrowserPlugins,
  watchSchema,
  buildSchema,
  watchWebpack,
  buildSchemaDefinition,
  buildWebpack,
} from '../build'

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
  await logger(buildBrowserPlugins({ config }), 'Build plugins')
  watch({ config })
}

async function buildCommand() {
  const config = await getConfig({ dev: false })
  console.log('Building schema')
  console.time('Build schema')
  await buildSchema({ config })
  console.timeEnd('Build schema')
  console.log('Building webpack')
  console.time('Build webpack')
  await buildWebpack({ config })
  console.timeEnd('Build webpack')
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

program.parse(process.argv)
