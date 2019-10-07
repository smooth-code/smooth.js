import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'smooth/query'
import { useLang } from 'smooth/i18n'

const PAGE = gql`
  query Page {
    page(slug: "test") {
      title
    }
  }
`

export default function Page() {
  const lang = useLang()
  return (
    <>
      <div>Lang: {lang}</div>
      <Query query={PAGE}>
        {({ data }) => (data ? data.page.title : null)}
      </Query>
    </>
  )
}
