import React, { useEffect, useRef } from 'react'
import { useLocation } from './Router'
import { onRouteUpdate } from '../plugin/browserHooks'

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
  onRouteUpdate(options)
  return null
}

export function RouterHooks() {
  const location = useLocation()
  if (location.hidden) return null
  return <RouterHooksInternal location={location} />
}
