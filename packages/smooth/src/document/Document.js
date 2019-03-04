import React from 'react'
import Html from './Html'
import Head from './Head'
import Main from './Main'
import MainScript from './MainScript'

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <MainScript />
      </body>
    </Html>
  )
}
