import React, { createContext, useState } from 'react'

const HiddenHistoryContext = createContext()

export function Provider({ children }) {
  const [state, setState] = useState({ location: null, action: null })
  return (
    <HiddenHistoryContext.Provider
      value={{
        location: state.location,
        action: state.action,
        push(location) {
          setState({ location, action: 'PUSH' })
        },
        replace(location) {
          setState({ location, action: 'REPLACE' })
        },
      }}
    >
      {children}
    </HiddenHistoryContext.Provider>
  )
}

export default HiddenHistoryContext
