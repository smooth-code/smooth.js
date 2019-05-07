import React, {
  useContext,
  useMemo,
  useCallback,
  createContext,
  useState,
  useRef,
} from 'react'
import { createLocation } from 'history'

const HiddenHistoryContext = createContext()

function createHiddenLocation(state) {
  if (!state) return null
  const location = createLocation(state[1], state[2])
  location.hidden = true
  return location
}

export function HiddenHistoryProvider({ children }) {
  const [state, setState] = useState(null)
  const reset = useCallback(() => setState(null), [])
  const push = useCallback(
    (location, state) => setState(['push', location, state]),
    [],
  )
  const replace = useCallback(
    (location, state) => setState(['replace', location, state]),
    [],
  )
  const hiddenHistory = useMemo(
    () => ({
      location: createHiddenLocation(state),
      state,
      reset,
      push,
      replace,
    }),
    [push, replace, reset, state],
  )

  return (
    <HiddenHistoryContext.Provider value={hiddenHistory}>
      {children}
    </HiddenHistoryContext.Provider>
  )
}

export function useHiddenHistory() {
  return useContext(HiddenHistoryContext)
}

// Create a local history, a mix with original history & hiddenHistory
export function useMixedHiddenHistory(originalHistory = {}) {
  const hiddenHistory = useHiddenHistory()
  const mixedHistory = useRef({})
  Object.assign(mixedHistory.current, originalHistory)
  mixedHistory.current.push = hiddenHistory.push
  mixedHistory.current.replace = hiddenHistory.replace
  if (hiddenHistory.location) {
    mixedHistory.current.location = hiddenHistory.location
  }
  return mixedHistory.current
}
