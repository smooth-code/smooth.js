import React from 'react'
import { Route } from './Router'

export function Status({ code, children }) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext && code) staticContext.status = code
        /* eslint-enable no-param-reassign */
        return children
      }}
    />
  )
}
