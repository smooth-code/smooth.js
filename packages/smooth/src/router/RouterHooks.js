import React, { useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
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

function RouterHooks({ location }) {
  const prevLocation = usePreviousLocation(location)
  const options = { location, prevLocation }
  useScrollTop(options)
  applyHook('onRouteUpdate', options)
  return null
}

function RouterHooksGuard({ location }) {
  if (location.hidden) return null
  return <RouterHooks location={location} />
}

export default withRouter(RouterHooksGuard)
