import React from 'react'

const CoreRouterContext = React.createContext(false)

export function CoreRouter({ children }) {
  return (
    <CoreRouterContext.Provider value>{children}</CoreRouterContext.Provider>
  )
}

export function useIsRouterReady() {
  return React.useContext(CoreRouterContext)
}
