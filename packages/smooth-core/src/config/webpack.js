import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import nodeExternals from 'webpack-node-externals'
import LoadablePlugin from '@loadable/webpack-plugin'

function fileExistsSync(filepath) {
  try {
    return fs.statSync(filepath).isFile()
  } catch (e) {
    // Check exception. If ENOENT - no such file or directory ok, file doesn't exist.
    // Otherwise something else went wrong, we don't have rights to access the file, ...
    if (e.code !== 'ENOENT') {
      throw e
    }

    return false
  }
}

function getScriptPath(config, script) {
  const customPath = path.join(config.srcPath, script)
  const defaultPath = path.join(__dirname, '../client', script)
  return fileExistsSync(customPath) ? customPath : defaultPath
}

function getTargetConfig(target, { config, dev }) {
  const mainEntry = path.join(__dirname, '../client', `main-${target}.js`)
  const isServer = target === 'node'
  const defaultLoaders = {
    babel: {
      loader: 'smooth-babel-loader',
      options: {
        dev,
        isServer,
        cwd: config.cwd,
        caller: { target },
      },
    },
  }
  const options = { isServer, defaultLoaders, dev }

  return config.webpack(
    {
      name: target,
      mode: dev ? 'development' : 'production',
      target,
      entry:
        target === 'web' && dev
          ? ['webpack-hot-middleware/client?name=web&reload=true', mainEntry]
          : mainEntry,
      resolveLoader: {
        modules: [path.join(__dirname, '../webpack/loaders'), 'node_modules'],
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: defaultLoaders.babel,
          },
        ],
      },
      resolve: {
        alias: {
          'smooth-core': path.join(__dirname, '..'),
          __smooth_fragmentTypes: path.join(
            config.cachePath,
            'fragmentTypes.json',
          ),
          __smooth_app: getScriptPath(config, '_app.js'),
          __smooth_document: getScriptPath(config, '_document.js'),
          __smooth_error: getScriptPath(config, '_error.js'),
          __smooth_content: getScriptPath(config, '_content.js'),
          __smooth_blocks: config.blocksPath,
          __smooth_pages: config.pagesPath,
        },
      },
      externals:
        target === 'node'
          ? [nodeExternals({ whitelist: [/smooth-core/] })]
          : undefined,
      output: {
        path: path.join(config.cachePath, target, 'static'),
        filename: dev ? '[name].js' : '[name]-bundle-[chunkhash:8].js',
        publicPath: `/${target}/static/`,
        libraryTarget: target === 'node' ? 'commonjs2' : undefined,
      },
      plugins: [
        new webpack.EnvironmentPlugin({
          __smooth_blocks: config.blocksPath,
          __smooth_pages: config.pagesPath,
        }),
        new LoadablePlugin(),
        ...(target === 'web' && dev
          ? [new webpack.HotModuleReplacementPlugin()]
          : []),
      ],
    },
    options,
  )
}

export async function getWebpackConfig({ config, dev }) {
  return [
    getTargetConfig('web', { config, dev }),
    getTargetConfig('node', { config, dev }),
  ]
}
