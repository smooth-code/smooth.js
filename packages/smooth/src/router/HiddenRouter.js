import React, {
  useRef,
  useCallback,
  createContext,
  useContext,
  useMemo,
  useEffect,
} from 'react'
import { createPath } from 'history'
import { Router, useHistory } from './Router'
import { useHiddenHistory } from './HiddenHistory'

const HiddenRouterContext = createContext()

export function useHiddenRouter() {
  return useContext(HiddenRouterContext)
}

export function usePause({ skip = false } = {}) {
  const resolve = useRef()
  const promise = useMemo(
    () =>
      new Promise(r => {
        resolve.current = r
      }),
    [],
  )
  const hiddenRouter = useHiddenRouter()
  useEffect(() => {
    if (hiddenRouter && !skip) {
      hiddenRouter.waitForPromise(promise)
    }
  }, [skip, hiddenRouter, promise])
  return resolve.current
}

function createURL(location) {
  return typeof location === 'string' ? location : createPath(location)
}

export function HiddenRouter({ children }) {
  const history = useHistory()
  const hiddenHistory = useHiddenHistory()
  const promises = useRef([])
  const timeoutRef = useRef()

  const flush = useCallback(() => {
    if (promises.current.length || !hiddenHistory.state) return
    const [method, action, state] = hiddenHistory.state
    history[method](action, state)
    hiddenHistory.reset()
  }, [hiddenHistory, history])

  const waitForPromise = useCallback(
    promise => {
      if (promises.current.includes(promise)) return
      promise.then(() => {
        const index = promises.current.indexOf(promise)
        if (index !== -1) {
          promises.current.splice(index, 1)
        }
        // 65ms is 4 frames, pretty invisible when we change page
        // it ensures that React have time to start a new request for an example
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => flush(), 65)
      })
      promises.current.push(promise)
    },
    [flush],
  )

  const hiddenRouter = useMemo(() => ({ waitForPromise }), [waitForPromise])

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
      createHref: path => createURL(path),
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
