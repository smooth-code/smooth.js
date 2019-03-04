import React from 'react'
import Document from 'smooth/document'
import { ServerStyleSheet } from 'styled-components'

Document.getInitialProps = async ctx => {
  const sheet = new ServerStyleSheet()

  const originalRenderPage = ctx.renderPage
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
    })

  return { styles: sheet.getStyleElement() }
}

export default Document
