import React from 'react'
import gql from 'graphql-tag'

export const contentFragment = gql`
  fragment PageFragment on Page {
    title
    date
    dateTime
    book {
      metadata {
        slug
      }
      name
    }
    specificBook {
      name
    }
    allBooks {
      metadata {
        id
      }
      name
    }
  }
`

export default function Page({
  title,
  book,
  specificBook,
  allBooks,
  ...props
}) {
  console.log(props)
  return (
    <div>
      <h2>Title</h2>
      <div>{title}</div>
      <h2>ACF book</h2>
      <div>{book.name}</div>
      <h2>Specific book</h2>
      <div>{specificBook && specificBook.name}</div>
      <h2>All books</h2>
      <ul>
        {allBooks.map(b => (
          <li key={b.metadata.id}>{b.name}</li>
        ))}
      </ul>
    </div>
  )
}
