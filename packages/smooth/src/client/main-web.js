import '@babel/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { loadableReady } from '@loadable/component'
import { createApolloClient } from './apollo'
import Root from './Root'
import ErrorContext from './ErrorContext'
import RouterHooks from '../router/RouterHooks'

loadableReady(() => {
  ReactDOM.hydrate(
    <ErrorContext.Provider value={{ error: window.__SMOOTH_ERROR__ }}>
      <ApolloProvider client={createApolloClient()}>
        <BrowserRouter>
          <>
            <RouterHooks />
            <Root />
          </>
        </BrowserRouter>
      </ApolloProvider>
    </ErrorContext.Provider>,
    document.getElementById('main'),
  )
})
