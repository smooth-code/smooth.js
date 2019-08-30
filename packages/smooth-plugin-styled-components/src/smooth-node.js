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

const sheetConfigByRequestId = new Map()

// eslint-disable-next-line react/prop-types,react/display-name
export function wrapRootElement({ element, requestId }) {
  const sheet = new ServerStyleSheet()

  // Sheet is automatically disposed after 2min to prevent memory leaks
  const disposeTimeout = setTimeout(() => {
    // eslint-disable-next-line no-use-before-define
    dispose()
  }, 120000)

  function dispose() {
    sheetConfigByRequestId.delete(requestId)
    clearTimeout(disposeTimeout)
  }

  const sheetConfig = { sheet, dispose }
  sheetConfigByRequestId.set(requestId, sheetConfig)
  return <StyleSheetManager sheet={sheet.instance}>{element}</StyleSheetManager>
}

export function onRenderBody({ setHeadComponents, requestId }) {
  const sheetConfig = sheetConfigByRequestId.get(requestId)
  if (sheetConfig) {
    const { sheet, dispose } = sheetConfig
    setHeadComponents([sheet.getStyleElement()])
    dispose()

    // Prevent cache bugs
    if (process.env.NODE_ENV !== 'production') {
      sheet.masterSheet.constructor.reset(true)
    }
  }
}
