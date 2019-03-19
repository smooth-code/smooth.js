import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'smooth/query'
import { useLang } from 'smooth/page'

const PAGE = gql`
  query Page($foo: String) {
    page(slug: "test") {
      title
    }
  }
`

export default function Page() {
  const lang = useLang()
  throw new Error('kk')
  return (
    <>
      <div>Lang: {lang}</div>
      <Query query={PAGE}>
        {({ data }) => (data ? data.page.title : null)}
      </Query>
    </>
  )
}
