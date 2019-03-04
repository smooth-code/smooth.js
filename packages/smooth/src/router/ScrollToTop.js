import { useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'

function ScrollToTop({ children, location }) {
  const previousLocation = useRef()
  useEffect(() => {
    if (
      previousLocation.current &&
      previousLocation.current.pathname !== location.pathname
    ) {
      // eslint-disable-next-line
      window.scrollTo(0, 0)
    }
    previousLocation.current = location.pathname
  }, [location.pathname])
  return children
}

export default withRouter(ScrollToTop)
