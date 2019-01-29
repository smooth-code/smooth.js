import React from 'react'

export default ({ Component, ...props }) => (
  <div className="layout">
    <Component {...props} />
  </div>
)
