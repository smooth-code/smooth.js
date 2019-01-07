import React from 'react'
import gql from 'graphql-tag'

export const contentFragment = gql`
  fragment BookFragment on Book {
    name
  }
`

export const slug = 'books'

export default function Book({ name }) {
  return <div>{name}</div>
}
