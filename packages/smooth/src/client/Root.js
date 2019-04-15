import React from 'react'
import Routes from './Routes'
import ErrorBoundary from './ErrorBoundary'
import ErrorContext from './ErrorContext'

export default function Root() {
  return (
    <ErrorContext.Consumer>
      {({ error }) => (
        <ErrorBoundary error={error}>
          <Routes />
        </ErrorBoundary>
      )}
    </ErrorContext.Consumer>
  )
}
