import React, { useMemo, useCallback, createContext, useState } from 'react'
import { createLocation } from 'history'

const HiddenHistoryContext = createContext()

function createHiddenLocation(state) {
  if (!state) return null
  const location = createLocation(state[1], state[2])
  location.hidden = true
  return location
}

export function Provider({ children }) {
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

export default HiddenHistoryContext
