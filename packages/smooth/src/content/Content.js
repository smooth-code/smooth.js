import React from 'react'
import { Query } from './Query'

export function Content({ Component }) {
  return (
    <Query>
      {({ loading, error, data }) => {
        if (error) {
          throw error
        }

        if (loading) {
          return null
        }

        return <Component {...data.contentProps} />
      }}
    </Query>
  )
}
