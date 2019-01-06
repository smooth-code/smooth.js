import React from 'react'
import App from '__smooth_app'
import ErrorBoundary from './ErrorBoundary'
import ErrorContext from './ErrorContext'

export default function AppContainer() {
  return (
    <ErrorContext.Consumer>
      {({ error }) => (
        <ErrorBoundary error={error}>
          <App />
        </ErrorBoundary>
      )}
    </ErrorContext.Consumer>
  )
}
