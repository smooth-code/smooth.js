import React from 'react'
import GlobalScript from './GlobalScript'

export default function FretchCache({ cache }) {
  return <GlobalScript varName="__FRETCH_CACHE__" json={cache} />
}
