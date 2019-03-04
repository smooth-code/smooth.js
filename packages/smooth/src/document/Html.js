/* eslint-disable jsx-a11y/html-has-lang */
import React from 'react'
import Context from './Context'

export default function Head({ children }) {
  return (
    <Context.Consumer>
      {({ helmet }) => (
        <html {...helmet.htmlAttributes.toComponent()}>{children}</html>
      )}
    </Context.Consumer>
  )
}
