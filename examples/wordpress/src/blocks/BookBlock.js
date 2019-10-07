import React from 'react'
import gql from 'graphql-tag'

export const blockFragment = gql`
  fragment BookBlockProps on BookBlock {
    book {
      name
      price
    }
  }
`

export default function BookBlock({ book: { name, price } }) {
  return (
    <div>
      This is a book {name} {price}
    </div>
  )
}
