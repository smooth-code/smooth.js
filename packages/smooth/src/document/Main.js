/* eslint-disable react/no-danger */
import React from 'react'
import Context from './Context'

export default function Main() {
  return (
    <Context.Consumer>
      {({ appHtml }) => (
        <div id="main" dangerouslySetInnerHTML={{ __html: appHtml }} />
      )}
    </Context.Consumer>
  )
}
