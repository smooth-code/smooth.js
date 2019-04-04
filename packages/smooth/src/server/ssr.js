import path from 'path'
import React from 'react'
import { Helmet } from 'react-helmet'
import { StaticRouter } from 'react-router-dom'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { renderToString } from 'react-dom/server'
import { ChunkExtractor } from '@loadable/server'
import asyncHandler from 'express-async-handler'
import { getContext, createApolloClient } from './apollo'
import { applyHook } from '../plugin/node'

function enhanceApp(options = {}, App) {
  return options.enhanceApp ? options.enhanceApp(App) : App
}

function clearCache() {
  const keys = Object.keys(require.cache)
  keys.forEach(key => {
    if (key.match(/node\/static\//)) {
      delete require.cache[key]
    }
  })
}

function onRenderBody(config, pathname) {
  let headComponents = []
  let htmlAttributes = []
  let bodyAttributes = []
  let preBodyComponents = []
  let postBodyComponents = []

  function setHeadComponents(components) {
    headComponents = [...headComponents, ...components]
  }

  function setHtmlAttributes(attributes) {
    htmlAttributes = [...htmlAttributes, ...attributes]
  }

  function setBodyAttributes(attributes) {
    bodyAttributes = [...bodyAttributes, ...attributes]
  }

  function setPreBodyComponents(components) {
    preBodyComponents = [...preBodyComponents, ...components]
  }

  function setPostBodyComponents(components) {
    postBodyComponents = [...postBodyComponents, ...components]
  }

  applyHook(config, 'onRenderBody', {
    pathname,
    setHeadComponents,
    setHtmlAttributes,
    setBodyAttributes,
    setPreBodyComponents,
    setPostBodyComponents,
  })

  return {
    headComponents,
    htmlAttributes,
    bodyAttributes,
    preBodyComponents,
    postBodyComponents,
  }
}

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

    if (config.env !== 'production') {
      clearCache()
    }

    const nodeExtractor = new ChunkExtractor({
      statsFile: nodeStats,
      outputPath: path.join(config.cachePath, 'node/static'),
    })

    const {
      Root,
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
            <Root error={error} />
          </StaticRouter>
        </ApolloProvider>
      </ErrorContext.Provider>
    )

    // Loadable components
    jsx = webExtractor.collectChunks(jsx)

    await getDataFromTree(jsx)
    const apolloState = apolloClient.cache.extract()

    function renderPage(options) {
      const App = enhanceApp(options, ({ children }) => children)
      return renderToString(<App>{jsx}</App>)
    }

    const context = {
      pathname: req.url,
      query: req.query,
      asPath: req.originalUrl,
      req,
      res,
      renderPage,
    }

    const initialProps = await DocumentContainer.getInitialProps(context)

    // Render app HTML
    const appHtml = renderPage()

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

    const pluginProps = onRenderBody(config, req.url)

    const html = renderToString(
      <DocumentContainer
        appHtml={appHtml}
        extractor={webExtractor}
        helmet={helmet}
        apolloState={apolloState}
        error={error}
        {...pluginProps}
        {...initialProps}
      />,
    )

    res.set('content-type', 'text/html')
    res.end(`<!DOCTYPE html>${html}`)
  })
}
