import React from 'react'
import Context from './Context'

export default function Head({ children }) {
  return (
    <Context.Consumer>
      {({ extractor, helmet, sheet }) => (
        <head>
          {extractor.getLinkElements()}
          {sheet.getStyleElement()}
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {children}
        </head>
      )}
    </Context.Consumer>
  )
}
