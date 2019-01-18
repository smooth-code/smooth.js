import React from 'react'
import gql from 'graphql-tag'

export const blockFragment = gql`
  fragment SimpleBlockProps on SimpleBlock {
    text
  }
`

export default function SimpleBlock({ text }) {
  return <div>{text}</div>
}
