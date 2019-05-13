import React, { useEffect, useCallback, useRef } from 'react'
import qs from 'query-string'
import { usePageContext } from '../page/PageContext'
import { usePause } from '../router/HiddenRouter'

function PrefetchHandler({ children, ...props }) {
  const unpause = usePause()
  useEffect(() => {
    if (!props.loading) {
      unpause()
    }
  }, [props.loading, unpause])
  return children(props)
}

function useOperationContext(props) {
  const { lang, location } = usePageContext()
  const headers = {}

  if (lang) {
    headers['x-smooth-lang'] = lang
  }

  if (props.pageContent) {
    const { id, preview } = qs.parse(location.search)
    if (preview) {
      headers['x-smooth-preview-id'] = id
      headers['x-smooth-preview'] = 1
    }
  }

  return { headers }
}

function useRequestHandler(props) {
  const propsRef = useRef({})
  propsRef.current = props
  return useCallback(result => {
    if (propsRef.current.prefetch)
      return (
        <PrefetchHandler {...result}>
          {propsRef.current.children}
        </PrefetchHandler>
      )
    return propsRef.current.children(result)
  }, [])
}

export function useOperationProps(props) {
  const context = useOperationContext(props)
  const children = useRequestHandler(props)
  return { ...props, context, children }
}
