/* eslint-disable react/no-danger */
import React from 'react'
import Context from './Context'

export default function Main() {
  return (
    <Context.Consumer>
      {({ appHtml, preBodyComponents, postBodyComponents }) => (
        <>
          {preBodyComponents}
          <div id="main" dangerouslySetInnerHTML={{ __html: appHtml }} />
          {postBodyComponents}
        </>
      )}
    </Context.Consumer>
  )
}
