import React from 'react'
import Context from './Context'

export default function Head({ children }) {
  return (
    <Context.Consumer>
      {({ extractor, helmet, styles }) => (
        <head>
          {extractor.getLinkElements()}
          {styles}
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {children}
        </head>
      )}
    </Context.Consumer>
  )
}
