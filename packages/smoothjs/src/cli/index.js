import program from 'commander'
import logUpdate from 'log-update'
import createLogger from 'progress-estimator'
import { getConfig } from '../config'
import { start } from '../server'
// import { Watcher, watchFs } from './watcher'
import { watchSchema, watchWebpack } from '../build'

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

  const webpackWatcher = watchWebpack({
    config,
    logger: createCustomLogger(3),
  })

  schemaWatcher.on('done', ({ schema, fragmentTypes }) => {
    start({
      schema,
      fragmentTypes,
      config,
      webpackMiddleware: webpackWatcher.middleware,
    })
  })

  const logServer = createCustomLogFunction(5)

  let count = 0
  function done() {
    count += 1
    if (count === 2) {
      logServer('Project ready 🚀')
    }
  }

  schemaWatcher.on('done', done)
  webpackWatcher.on('done', done)
  // eslint-disable-next-line no-console
  schemaWatcher.on('error', console.error)
  // eslint-disable-next-line no-console
  webpackWatcher.on('error', console.error)
}

function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H',
  )
}

async function devCommand() {
  clearConsole()
  const config = await getConfig()
  watch({ config })
}

// async function buildCommand() {
//   clearConsole()
//   const config = await getConfig()
//   await build({ config })
//   await buildWebpack({ config })
// }

function startCommand(command) {
  command().catch(error => {
    // eslint-disable-next-line no-console
    console.error(error)
  })
}

program.command('dev').action(() => startCommand(devCommand))
// program.command('build').action(() => buildCommand(devCommand))

program.parse(process.argv)
