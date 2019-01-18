import React from 'react'

export default function App({ Component, ...props }) {
  return <Component {...props} />
}
