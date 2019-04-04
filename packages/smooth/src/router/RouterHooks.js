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

function useScrollTop({ location, previousLocation }) {
  useEffect(() => {
    if (previousLocation && previousLocation.pathname !== location.pathname) {
      // eslint-disable-next-line
      window.scrollTo(0, 0)
    }
  }, [location, previousLocation])
}

function RouterHooks({ location }) {
  const previousLocation = usePreviousLocation(location)
  const options = { location, previousLocation }
  useScrollTop(options)
  applyHook('onRouteUpdate', options)
  return null
}

function RouterHooksGuard({ location }) {
  if (location.hidden) return null
  return <RouterHooks location={location} />
}

export default withRouter(RouterHooksGuard)
