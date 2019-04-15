/* eslint-disable react/no-danger */
import React from 'react'

export default function GlobalScript({ varName, json }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.${varName} = ${JSON.stringify(json)};`,
      }}
    />
  )
}
