import React from 'react'
import Context from './Context'

export default function Head({ children }) {
  return (
    <Context.Consumer>
      {({ extractor, helmet, styles, headComponents }) => (
        <head>
          {extractor.getLinkElements()}
          {styles}
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {headComponents}
          {children}
        </head>
      )}
    </Context.Consumer>
  )
}
