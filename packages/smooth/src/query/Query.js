import React, { useEffect } from 'react'
import qs from 'query-string'
import { Query as ApolloQuery } from 'react-apollo'
import { usePageContext } from '../page/PageContext'
import { usePause } from '../router/HiddenRouter'

function getQueryContext(location, lang) {
  const { id, preview } = qs.parse(location.search)
  const headers = {}

  if (lang) {
    headers['x-smooth-lang'] = lang
  }

  if (preview) {
    headers['x-smooth-preview-id'] = id
    headers['x-smooth-preview'] = 1
  }

  return { headers }
}

function PrefetchHandler({ children, ...props }) {
  const unpause = usePause()
  useEffect(() => {
    if (!props.loading) {
      unpause()
    }
  }, [props.loading, unpause])
  return children(props)
}

export function Query({ children, prefetch = true, context, ...props }) {
  const { lang, location } = usePageContext()

  return (
    <ApolloQuery context={getQueryContext(location, lang)} {...props}>
      {apolloProps =>
        prefetch ? (
          <PrefetchHandler {...apolloProps}>{children}</PrefetchHandler>
        ) : (
          children(apolloProps)
        )
      }
    </ApolloQuery>
  )
}
