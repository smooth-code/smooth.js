import React from 'react'
import gql from 'graphql-tag'
import { BlockFragment, Blocks } from 'smooth-core/blocks'

export const contentFragment = gql`
  fragment PageProps on Page {
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
    link {
      url
    }
    blocks {
      ...BlockFragment
    }
  }

  ${BlockFragment}
`

export default function Page({ title, book, specificBook, allBooks, blocks }) {
  return (
    <div>
      <h2>Title</h2>
      <div>{title}</div>
      <h2>ACF book</h2>
      <div>{book && book.name}</div>
      <h2>Specific book</h2>
      <div>{specificBook && specificBook.name}</div>
      <h2>All books</h2>
      <ul>
        {allBooks.map(b => (
          <li key={b.metadata.id}>{b.name}</li>
        ))}
      </ul>
      <Blocks blocks={blocks} />
    </div>
  )
}
