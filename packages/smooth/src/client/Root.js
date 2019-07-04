import React from 'react'
import { Route } from '../router'
import Routes from './Routes'
import ErrorBoundary from './ErrorBoundary'
import { useError } from './ErrorContext'
import { HiddenHistoryProvider } from '../router/HiddenHistory'

export default function Root() {
  const error = useError()
  return (
    <HiddenHistoryProvider>
      <Route
        path="/:lang(.{2})?"
        render={routeProps => (
          <ErrorBoundary lang={routeProps.match.params.lang} error={error}>
            <Routes {...routeProps} />
          </ErrorBoundary>
        )}
      />
    </HiddenHistoryProvider>
  )
}
