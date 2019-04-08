import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'smooth/query'

const PAGE = gql`
  query Page {
    page(slug: "test") {
      title
    }
  }
`

export default function Page({ Component, ...props }) {
  return (
    <Query query={PAGE}>
      {({ data }) =>
        data.page && (
          <>
            <h1>{data.page.title}</h1>
            <Component {...props} />
          </>
        )
      }
    </Query>
  )
}
