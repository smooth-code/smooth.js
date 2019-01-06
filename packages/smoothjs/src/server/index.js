import { createExpressApp } from './expressApp'
import { createHttpServer } from './httpServer'

let server
export function start({ config, schema, fragmentTypes, webpackMiddleware }) {
  const app = createExpressApp({
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
