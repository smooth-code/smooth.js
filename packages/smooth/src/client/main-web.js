import 'core-js'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import { loadableReady } from '@loadable/component'
import { createCache, CacheProvider } from 'fretch'
import Root from './Root'
import { ErrorContextProvider } from './ErrorContext'
import { BrowserRouter } from '../router'
import { RouterHooks } from '../router/RouterHooks'

loadableReady(() => {
  const cache = createCache().restore(window.__FRETCH_CACHE__)
  ReactDOM.hydrate(
    <ErrorContextProvider error={window.__SMOOTH_ERROR__}>
      <CacheProvider cache={cache}>
        <BrowserRouter>
          <>
            <RouterHooks />
            <Root />
          </>
        </BrowserRouter>
      </CacheProvider>
    </ErrorContextProvider>,
    document.getElementById('___smooth'),
  )
})
