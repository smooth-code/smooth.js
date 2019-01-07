import React from 'react'
import gql from 'graphql-tag'

export const contentFragment = gql`
  fragment PageFragment on Page {
    title
    book {
      name
    }
  }
`

export default function Page({ title, book }) {
  return (
    <div>
      {title}
      <div>{book.name}</div>
    </div>
  )
}
