import React from 'react'
import Routes from './Routes'
import ErrorBoundary from './ErrorBoundary'
import ErrorContext from './ErrorContext'
import Head from './Head'

export default function Root() {
  return (
    <ErrorContext.Consumer>
      {({ error }) => (
        <ErrorBoundary error={error}>
          <Head />
          <Routes />
        </ErrorBoundary>
      )}
    </ErrorContext.Consumer>
  )
}
