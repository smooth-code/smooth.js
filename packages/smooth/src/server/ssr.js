import path from 'path'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'
import { ChunkExtractor } from '@loadable/server'
import asyncHandler from 'express-async-handler'
import { getDataFromTree, createCache, CacheProvider } from 'fretch'
import SmoothError from './components/SmoothError'
import FretchCache from './components/FretchCache'
import { onRenderBody, wrapRootElement } from '../plugin/nodeHooks'

export default function ssrMiddleware({ config, error = null }) {
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
      Root,
      Html,
      ErrorContextProvider,
    } = nodeExtractor.requireEntrypoint()

    const webExtractor = new ChunkExtractor({ statsFile: webStats })
    const routerContext = {}
    const cache = createCache()

    let jsx = (
      <ErrorContextProvider error={error}>
        <CacheProvider cache={cache}>
          <StaticRouter location={req.url} context={routerContext}>
            <Root error={error} />
          </StaticRouter>
        </CacheProvider>
      </ErrorContextProvider>
    )

    // Generate unique request id
    const requestId = Math.random()
      .toString(36)
      .substring(7)

    const rootElement = wrapRootElement(config)({
      element: jsx,
      pathname: req.url,
      requestId,
    })

    // Loadable components
    jsx = webExtractor.collectChunks(jsx)

    await getDataFromTree(jsx)

    // Render app HTML
    const appHtml = renderToString(rootElement)

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

    const headComponents = webExtractor.getStyleElements()

    const postBodyComponents = [
      <SmoothError key="smooth-error" error={error} />,
      <FretchCache key="fretch-cache" cache={cache.extract()} />,
      ...webExtractor.getScriptElements(),
    ]

    const pluginProps = onRenderBody(config)({
      headComponents,
      postBodyComponents,
      pathname: req.url,
      requestId,
    })

    const html = renderToString(<Html {...pluginProps} body={appHtml} />)

    res.set('content-type', 'text/html')
    res.end(`<!DOCTYPE html>${html}`)
  })
}
