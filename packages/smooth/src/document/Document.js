import React from 'react'
import Html from './Html'
import Head from './Head'
import Main from './Main'
import MainScript from './MainScript'
import Context from './Context'

export default function Document() {
  return (
    <Context.Consumer>
      {({ bodyAttributes }) => (
        <Html>
          <Head />
          <body {...bodyAttributes}>
            <Main />
            <MainScript />
          </body>
        </Html>
      )}
    </Context.Consumer>
  )
}
