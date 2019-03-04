import { createExpressApp } from './expressApp'
import { createHttpServer } from './httpServer'

let server
export function start({
  config,
  dev,
  schema,
  fragmentTypes,
  webpackMiddleware,
}) {
  const app = createExpressApp({
    dev,
    config,
    schema,
    fragmentTypes,
    webpackMiddleware,
  })

  if (server) {
    server.swap(app)
    return server
  }

  server = createHttpServer({ config, app })

  server.listen(config.server.port, err => {
    if (err) {
      throw err
    }
  })

  return server
}
