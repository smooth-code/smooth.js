import React, {
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from 'react'
import { Router, withRouter } from 'react-router-dom'
import HiddenHistoryContext from './HiddenHistoryContext'

export const HiddenRouterContext = createContext()

export function useHiddenRouter() {
  return useContext(HiddenRouterContext)
}

function HiddenRouter({ history, children }) {
  const hiddenHistory = useContext(HiddenHistoryContext)
  const promises = useRef([])

  const flush = useCallback(() => {
    if (promises.current.length || !hiddenHistory.state) return
    const [method, action, state] = hiddenHistory.state
    history[method](action, state)
    hiddenHistory.reset()
  }, [hiddenHistory, history])

  const waitForPromise = useCallback(
    promise => {
      promise.then(() => {
        const index = promises.current.indexOf(promise)
        if (index !== -1) {
          promises.current.splice(index, 1)
        }
        flush()
      })
      promises.current.push(promise)
    },
    [flush],
  )

  const hiddenRouter = useMemo(() => ({ waitForPromise }), [waitForPromise])

  useEffect(() => {
    const timeout = setTimeout(() => flush(), 20)
    return () => clearTimeout(timeout)
  }, [flush])

  const staticHistory = useMemo(() => {
    if (!hiddenHistory.location) return null
    const noop = () => {}
    return {
      action: 'POP',
      location: hiddenHistory.location,
      push: noop,
      replace: noop,
      go: noop,
      goBack: noop,
      goForward: noop,
      listen: () => noop,
      block: () => noop,
    }
  }, [hiddenHistory.location])

  return staticHistory ? (
    <div style={{ display: 'none' }} hidden>
      <HiddenRouterContext.Provider value={hiddenRouter}>
        <Router history={staticHistory}>{children}</Router>
      </HiddenRouterContext.Provider>
    </div>
  ) : null
}

export default withRouter(HiddenRouter)
