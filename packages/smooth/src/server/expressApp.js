import path from 'path'
import express from 'express'
import errorHandler from 'errorhandler'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { getContext } from './apollo'
import ssr from './ssr'
import { onCreateServer, onCreateApolloServerConfig } from '../plugin/nodeHooks'

export function createExpressApp({
  dev,
  config,
  schema,
  fragmentTypes,
  webpackMiddleware,
}) {
  const app = express()

  onCreateServer(config)({ app })

  app.use(cors())

  app.get('/favicon.ico', (req, res) => {
    res.send(null)
  })

  app.use(
    '/web',
    express.static(
      path.join(config.cachePath, 'web'),
      dev
        ? {}
        : {
            immutable: true,
            maxage: 31536000000,
          },
    ),
  )

  app.use(
    '/static',
    express.static(
      config.staticPath,
      dev
        ? {}
        : {
            immutable: true,
            maxage: 31536000000,
          },
    ),
  )

  if (webpackMiddleware) {
    app.use(webpackMiddleware)
  }

  const apolloServerConfig = onCreateApolloServerConfig(config)({
    apolloServerConfig: {
      schema,
      context: ({ req }) => getContext({ req, config }),
    },
  })

  const apolloServer = new ApolloServer(apolloServerConfig)

  apolloServer.applyMiddleware({ app })

  app.use(ssr({ config, schema, fragmentTypes }))

  onCreateServer(config)({ app })

  if (config.env === 'development') {
    app.use((error, req, res, next) => {
      const graphQLErrors =
        (error.networkError ? error.networkError.errors : null) ||
        error.graphQLErrors

      if (graphQLErrors) {
        const lines = ['Error: GraphQL & Apollo']
        graphQLErrors.forEach((graphQLError, index) => {
          lines.push(
            `--- GraphQL Error #${index}: ${
              graphQLError.path ? graphQLError.path.join(' > ') : 'validation'
            }`,
          )
          lines.push(graphQLError.stack)
          lines.push('   \n   \n')
        })
        lines.push('--- Original Error')
        lines.push(error.stack)
        error.stack = lines.join('\n')
      }

      // eslint-disable-next-line no-console
      console.error(error.stack)
      next(error)
    })
  }

  app.use((error, req, res, next) => {
    ssr({ config, schema, fragmentTypes, error, dev })(req, res, next)
  })
  app.use(errorHandler({ log: false }))

  return app
}
