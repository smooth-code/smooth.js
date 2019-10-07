import 'core-js'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import { loadableReady } from '@loadable/component'
import { createApolloClient } from './apollo'
import Root from './Root'
import { ErrorContextProvider } from './ErrorContext'
import { BrowserRouter } from '../router'
import { RouterHooks } from '../router/RouterHooks'

loadableReady(() => {
  ReactDOM.hydrate(
    <ErrorContextProvider error={window.__SMOOTH_ERROR__}>
      <ApolloProvider client={createApolloClient()}>
        <BrowserRouter>
          <>
            <RouterHooks />
            <Root />
          </>
        </BrowserRouter>
      </ApolloProvider>
    </ErrorContextProvider>,
    document.getElementById('___smooth'),
  )
})
