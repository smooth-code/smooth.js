import React, { useContext, useMemo } from 'react'

const PageContext = React.createContext({ page: null })

export function PageContextProvider({ context, children }) {
  // eslint-disable-next-line
  const value = useMemo(() => context, [context.match])
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}

export default PageContext

export function usePage() {
  const { page } = useContext(PageContext)
  return page
}
