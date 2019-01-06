import React from 'react'
import { Route } from 'react-router-dom'

const Status = ({ code, children }) => (
  <Route
    render={({ staticContext }) => {
      if (staticContext && code) staticContext.status = code
      /* eslint-enable no-param-reassign */
      return children
    }}
  />
)

export default Status
