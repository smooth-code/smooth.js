import React from 'react'
import Document from '__smooth_document'
import Context from './Context'

export default function DocumentContainer(props) {
  return (
    <Context.Provider value={props}>
      <Document />
    </Context.Provider>
  )
}
