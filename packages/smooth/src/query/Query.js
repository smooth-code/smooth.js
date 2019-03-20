import React, { useContext, useEffect } from 'react'
import qs from 'query-string'
import { Query as ApolloQuery } from 'react-apollo'
import { usePageContext } from '../page/PageContext'
import { HiddenRouterContext } from '../router/HiddenRouter'

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
  const hiddenRouter = useContext(HiddenRouterContext)
  useEffect(() => {
    if (hiddenRouter && !props.loading) {
      hiddenRouter.onPrefetched()
    }
  }, [props.loading]) // eslint-disable-line react-hooks/exhaustive-deps

  return children(props)
}

export function Query({ children, prefetch, context, ...props }) {
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
