import http from 'http'

export function createHttpServer({ app }) {
  let currentApp = app
  const server = http.createServer((req, res) => {
    currentApp(req, res)
  })
  server.swap = newApp => {
    currentApp = newApp
  }
  return server
}
