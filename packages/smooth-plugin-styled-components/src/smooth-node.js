/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */

import React from 'react'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

// Add Babel plugin
try {
  require.resolve(`babel-plugin-styled-components`)
} catch (e) {
  throw new Error(
    `'babel-plugin-styled-components' is not installed which is needed by plugin 'gatsby-plugin-styled-components'`,
  )
}

export function onCreateBabelConfig({ actions }, pluginOptions) {
  actions.setBabelPlugin({
    name: `babel-plugin-styled-components`,
    options: { ...pluginOptions, ssr: true },
  })
}

const sheetByPathname = new Map()

// eslint-disable-next-line react/prop-types,react/display-name
export function wrapRootElement({ element, pathname }) {
  const sheet = new ServerStyleSheet()
  sheetByPathname.set(pathname, sheet)
  return <StyleSheetManager sheet={sheet.instance}>{element}</StyleSheetManager>
}

export function onRenderBody({ setHeadComponents, pathname }) {
  const sheet = sheetByPathname.get(pathname)
  if (sheet) {
    setHeadComponents([sheet.getStyleElement()])
    sheetByPathname.delete(pathname)
    sheet.seal()

    // Prevent cache bugs
    if (process.env.NODE_ENV === 'development') {
      sheet.masterSheet.constructor.reset(true)
    }
  }
}
