export default function webpackMiddleware({ config }, onCreateCompiler) {
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpack = require('webpack')
  const compiler = webpack(config.webpackConfig)

  onCreateCompiler(compiler)

  const devMiddlewareInstance = webpackDevMiddleware(
    compiler,
    config.webpackDevMiddleware({
      logLevel: 'error',
      publicPath: '/dist/web/',
      writeToDisk(filePath) {
        return /node\/static/.test(filePath) || /loadable-stats/.test(filePath)
      },
    }),
  )

  const hotMiddlewareInstance = webpackHotMiddleware(compiler, { log: false })

  const middlewares = [devMiddlewareInstance, hotMiddlewareInstance]

  async function ready() {
    return new Promise(resolve => {
      devMiddlewareInstance.waitUntilValid(() => resolve())
    })
  }

  middlewares.ready = ready
  middlewares.compiler = compiler
  return middlewares
}
