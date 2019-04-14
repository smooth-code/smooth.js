import React from 'react'
import GlobalScript from './GlobalScript'

export default function ApolloState({ state }) {
  return <GlobalScript varName="__APOLLO_STATE__" json={state} />
}
