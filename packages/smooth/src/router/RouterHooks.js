import React, { useEffect, useRef } from 'react'
import { useRouter } from './Router'
import { applyHook } from '../plugin/browser'

function usePreviousLocation(location) {
  const previousLocation = useRef(null)
  useEffect(() => {
    previousLocation.current = location.pathname
  }, [location.pathname])
  return previousLocation.current
}

function useScrollTop({ location, prevLocation }) {
  useEffect(() => {
    if (prevLocation && prevLocation.pathname !== location.pathname) {
      // eslint-disable-next-line
      window.scrollTo(0, 0)
    }
  }, [location, prevLocation])
}

function RouterHooksInternal({ location }) {
  const prevLocation = usePreviousLocation(location)
  const options = { location, prevLocation }
  useScrollTop(options)
  applyHook('onRouteUpdate', options)
  return null
}

export function RouterHooks() {
  const { location } = useRouter()
  if (location.hidden) return null
  return <RouterHooksInternal location={location} />
}
