import React, { useContext, useMemo } from 'react'

const PageContext = React.createContext({
  lang: null,
  page: null,
  history: null,
  match: null,
  location: null,
})

export function PageContextProvider({ context, children }) {
  // eslint-disable-next-line
  const value = useMemo(() => context, [context.lang, context.match])
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}

export default PageContext

export function usePageContext() {
  return useContext(PageContext)
}

export function useLang() {
  const { lang } = useContext(PageContext)
  return lang
}
