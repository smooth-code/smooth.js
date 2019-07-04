import React from 'react'

const ErrorContext = React.createContext({ error: null })

export function ErrorContextProvider({ error, children }) {
  const value = React.useMemo(() => ({ error }), [error])
  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
}

export function useError() {
  const { error } = React.useContext(ErrorContext)
  return error
}
