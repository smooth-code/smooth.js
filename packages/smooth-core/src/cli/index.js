import path from 'path'
import program from 'commander'
import logUpdate from 'log-update'
import createLogger from 'progress-estimator'
import { getConfig } from '../config'
import { start } from '../server'
import {
  watchSchema,
  buildSchema,
  watchWebpack,
  buildSchemaDefinition,
  buildWebpack,
} from '../build'

let stdout = `Smooth CMS 👨‍🚀
 



`
function createCustomLogFunction(line) {
  function logFunction(str) {
    const lines = stdout.split('\n')
    lines[line] = str
    stdout = lines.join('\n')
    logUpdate(stdout)
  }

  logFunction.clear = logUpdate.clear
  logFunction.done = () => {}
  return logFunction
}

function createCustomLogger(line) {
  return createLogger({ logFunction: createCustomLogFunction(line) })
}

function watch({ config }) {
  const schemaWatcher = watchSchema({
    config,
    logger: createCustomLogger(2),
  })

  const logServer = createCustomLogFunction(5)

  let count = 0
  function done() {
    count += 1
    if (count === 2) {
      logServer('Project ready 🚀')
    }
  }

  schemaWatcher.on('done', ({ schema, fragmentTypes }) => {
    const webpackWatcher = watchWebpack({
      config,
      logger: createCustomLogger(3),
    })

    start({
      dev: true,
      schema,
      fragmentTypes,
      config,
      webpackMiddleware: webpackWatcher.middleware,
    })

    webpackWatcher.on('done', done)
    // eslint-disable-next-line no-console
    webpackWatcher.on('error', console.error)
  })

  schemaWatcher.on('done', done)
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
  const config = await getConfig({ dev: true })
  logUpdate.done()
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

program.command('dev').action(() => runCmd(devCommand))
program.command('build').action(() => runCmd(buildCommand))
program.command('start').action(() => runCmd(startCommand))

program.parse(process.argv)
