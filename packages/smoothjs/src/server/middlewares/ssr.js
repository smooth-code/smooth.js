import path from 'path'
import React from 'react'
import { Helmet } from 'react-helmet'
import { StaticRouter } from 'react-router-dom'
import { ServerStyleSheet } from 'styled-components'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { renderToString } from 'react-dom/server'
import { ChunkExtractor } from '@loadable/server'
import asyncHandler from 'express-async-handler'
import { getContext, createApolloClient } from '../apollo'

export default function ssrMiddleware({
  config,
  schema,
  fragmentTypes,
  error = null,
}) {
  return asyncHandler(async (req, res) => {
    const nodeStats = path.resolve(
      config.cachePath,
      'node/static/loadable-stats.json',
    )

    const webStats = path.resolve(
      config.cachePath,
      'web/static/loadable-stats.json',
    )

    const nodeExtractor = new ChunkExtractor({
      statsFile: nodeStats,
      outputPath: path.join(config.cachePath, 'node/static'),
    })

    const {
      AppContainer,
      DocumentContainer,
      ErrorContext,
    } = nodeExtractor.requireEntrypoint()

    const webExtractor = new ChunkExtractor({ statsFile: webStats })
    const routerContext = {}
    const apolloClient = createApolloClient({
      schema,
      fragmentTypes,
      context: getContext({ req, config }),
    })

    let jsx = (
      <ErrorContext.Provider value={{ error }}>
        <ApolloProvider client={apolloClient}>
          <StaticRouter location={req.url} context={routerContext}>
            <AppContainer error={error} />
          </StaticRouter>
        </ApolloProvider>
      </ErrorContext.Provider>
    )

    // Styled components
    const sheet = new ServerStyleSheet()
    jsx = sheet.collectStyles(jsx)

    // Loadable components
    jsx = webExtractor.collectChunks(jsx)

    await getDataFromTree(jsx)
    const apolloState = apolloClient.cache.extract()

    // Render app HTML
    const appHtml = renderToString(jsx)

    // Handle React router status
    if (routerContext.status) {
      res.status(routerContext.status)
    }

    // Handle React Router redirection
    if (routerContext.url) {
      const status = routerContext.status === 301 ? 301 : 302
      res.redirect(status, routerContext.url)
      return
    }

    const helmet = Helmet.renderStatic()

    const html = renderToString(
      <DocumentContainer
        appHtml={appHtml}
        sheet={sheet}
        extractor={webExtractor}
        helmet={helmet}
        apolloState={apolloState}
        error={error}
      />,
    )

    res.set('content-type', 'text/html')
    res.end(`<!DOCTYPE html>${html}`)
  })
}
