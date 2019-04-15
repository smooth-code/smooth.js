import path from 'path'
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { renderToString } from 'react-dom/server'
import { ChunkExtractor } from '@loadable/server'
import asyncHandler from 'express-async-handler'
import { getContext, createApolloClient } from './apollo'
import { applyHook } from '../plugin/node'
import ApolloState from './components/ApolloState'
import SmoothError from './components/SmoothError'

function onRenderBody(
  config,
  {
    headComponents = [],
    htmlAttributes = {},
    bodyAttributes = {},
    preBodyComponents = [],
    postBodyComponents = [],
    bodyProps = {},
    pathname,
  },
) {
  function setHeadComponents(components) {
    headComponents = [...headComponents, ...components]
  }

  function setHtmlAttributes(attributes) {
    htmlAttributes = { ...htmlAttributes, ...attributes }
  }

  function setBodyAttributes(attributes) {
    bodyAttributes = { ...bodyAttributes, ...attributes }
  }

  function setPreBodyComponents(components) {
    preBodyComponents = [...preBodyComponents, ...components]
  }

  function setPostBodyComponents(components) {
    postBodyComponents = [...postBodyComponents, ...components]
  }

  function setBodyProps(props) {
    bodyProps = { ...bodyProps, ...props }
  }

  applyHook(config, 'onRenderBody', {
    pathname,
    setHeadComponents,
    setHtmlAttributes,
    setBodyAttributes,
    setPreBodyComponents,
    setPostBodyComponents,
    setBodyProps,
  })

  return {
    headComponents,
    htmlAttributes,
    bodyAttributes,
    preBodyComponents,
    postBodyComponents,
    bodyProps,
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

    const nodeExtractor = new ChunkExtractor({
      statsFile: nodeStats,
      outputPath: path.join(config.cachePath, 'node/static'),
    })

    const { Root, Html, ErrorContext } = nodeExtractor.requireEntrypoint()

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

    const rootElement = applyHook(
      config,
      'wrapRootElement',
      { element: jsx, pathname: req.url },
      'element',
    )

    // Loadable components
    jsx = webExtractor.collectChunks(jsx)

    await getDataFromTree(jsx)
    const apolloState = apolloClient.cache.extract()

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

    const postBodyComponents = [
      <SmoothError key="smooth-error" error={error} />,
      <ApolloState key="apollo-state" state={apolloState} />,
      ...webExtractor.getScriptElements(),
    ]

    const pluginProps = onRenderBody(config, {
      postBodyComponents,
      pathname: req.url,
    })

    const html = renderToString(<Html {...pluginProps} body={appHtml} />)

    res.set('content-type', 'text/html')
    res.end(`<!DOCTYPE html>${html}`)
  })
}
