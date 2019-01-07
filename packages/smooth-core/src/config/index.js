import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import cwd from 'cwd'
import merge from 'merge-deep'
import babelRequire from '../babel/require'
import { getWebpackConfig } from './webpack'
import { parsePlugins } from './plugins'

const exists = promisify(fs.exists)

export async function getConfig() {
  const configPath = 'scms.config.js'
  const localCwd = cwd()
  const absConfigPath = path.resolve(localCwd, configPath)
  const configExists = await exists(absConfigPath)

  if (!configExists) {
    throw new Error(`Error: config not found "${configPath}"`)
  }

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const getLocalConfig = babelRequire(absConfigPath)

  const defaultConfig = {
    env: process.env.NODE_ENV || 'development',
    cwd: localCwd,
    cache: false,
    cachePath: path.join(localCwd, '.smooth'),
    staticPath: path.join(localCwd, 'static'),
    srcPath: path.join(localCwd, 'src'),
    blocksPath: path.join(localCwd, 'src/blocks'),
    contentsPath: path.join(localCwd, 'src/contents'),
    schemasPath: path.join(localCwd, 'src/schemas'),
    server: {
      port: 3000,
    },
    webpackConfig: null,
    plugins: [],
    webpack: x => x,
    webpackDevMiddleware: x => x,
  }

  const localConfig = getLocalConfig
  const config = merge({}, defaultConfig, localConfig)
  config.webpackConfig = await getWebpackConfig({ config })
  config.plugins = parsePlugins(config.plugins)
  return config
}
