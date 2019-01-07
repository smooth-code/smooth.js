import React from 'react'
import gql from 'graphql-tag'

export const contentFragment = gql`
  fragment PageFragment on Page {
    metadata {
      slug
    }
    title
    book {
      metadata {
        slug
      }
      name
    }
  }
`

export default function Page({ title, book, metadata }) {
  return (
    <div>
      {metadata.slug}
      {title}
      <div>{book.name}</div>
    </div>
  )
}
