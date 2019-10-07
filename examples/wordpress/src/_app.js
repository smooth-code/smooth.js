import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'smooth/graphql'

const PAGE = gql`
  query Page {
    page(slug: "test") {
      title
    }
  }
`

export default function Page({ Component, ...props }) {
  const { data } = useQuery(PAGE)
  return data ? (
    <>
      <h1>{data.page.title}</h1>
      <Component {...props} />
    </>
  ) : null
}
