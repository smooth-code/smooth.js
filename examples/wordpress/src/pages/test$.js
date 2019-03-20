import React from 'react'
import gql from 'graphql-tag'

export const contentFragment = gql`
  fragment PageProps on Page {
    title
  }
`

export default function Page({ title }) {
  return (
    <div>
      <h2>Title</h2>
      <div>{title}</div>
    </div>
  )
}
