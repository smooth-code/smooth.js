import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import cwd from 'cwd'
import merge from 'merge-deep'
import babelRequire from '../babel/require'
import { getWebpackConfig } from './webpack'
import { parsePlugins } from './plugins'

const exists = promisify(fs.exists)

async function mergeLocalConfig(configPath, defaultConfig) {
  const configExists = await exists(configPath)

  if (!configExists) {
    return defaultConfig
  }

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const localConfig = babelRequire(configPath)
  const config = merge(defaultConfig, localConfig)
  if (localConfig.webpack) config.webpack = localConfig.webpack
  if (localConfig.webpackDevMiddleware)
    config.webpackDevMiddleware = localConfig.webpackDevMiddleware
  return config
}

export async function getConfig({ dev }) {
  const localCwd = cwd()

  const defaultConfig = {
    env: process.env.NODE_ENV || 'development',
    cwd: localCwd,
    cache: false,
    cachePath: path.join(localCwd, '.smooth'),
    staticPath: path.join(localCwd, 'static'),
    srcPath: path.join(localCwd, 'src'),
    blocksPath: path.join(localCwd, 'src/blocks'),
    pagesPath: path.join(localCwd, 'src/pages'),
    schemasPath: path.join(localCwd, 'src/schemas'),
    seedsPath: path.join(localCwd, process.env.SEEDS_PATH || './seeds'),
    server: {
      port: process.env.PORT || 3000,
    },
    webpackConfig: null,
    plugins: [],
    webpack: x => x,
    webpackDevMiddleware: x => x,
  }

  const config = await mergeLocalConfig(
    path.resolve(localCwd, 'smooth.config.js'),
    defaultConfig,
  )

  config.plugins = parsePlugins(config.plugins)
  config.webpackConfig = await getWebpackConfig({ config, dev })
  return config
}
