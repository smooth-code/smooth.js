import React from 'react'
import { Route } from '../router'
import Routes from './Routes'
import ErrorBoundary from './ErrorBoundary'
import { useError } from './ErrorContext'
import { HiddenHistoryProvider } from '../router/HiddenHistory'
import { I18nContextProvider } from '../i18n/I18nContext'
import { i18nRootPath } from '../i18n/Route'

export default function Root() {
  const error = useError()
  return (
    <HiddenHistoryProvider>
      <Route
        path={i18nRootPath}
        render={routeProps => (
          <I18nContextProvider lang={routeProps.match.params.lang || null}>
            <ErrorBoundary error={error}>
              <Routes {...routeProps} />
            </ErrorBoundary>
          </I18nContextProvider>
        )}
      />
    </HiddenHistoryProvider>
  )
}
