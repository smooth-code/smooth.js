import React from 'react'
import gql from 'graphql-tag'
import { BlockFragment, Blocks } from 'smooth/content'
import { Link } from 'smooth/router'

export const contentFragment = gql`
  fragment PageProps on Page {
    title
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
        slug
      }
      name
    }
    link {
      url
    }
    blocks {
      ...BlockFragment
    }
    metadata {
      id
      slug
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
          <li key={b.metadata.id}>
            <Link waitBeforeTransition to={`/books/${b.metadata.slug}`}>
              {b.name}
            </Link>
          </li>
        ))}
      </ul>
      <Link waitBeforeTransition to="/hello">
        hello
      </Link>
      <Blocks blocks={blocks} />
    </div>
  )
}
