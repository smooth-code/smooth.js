import React from 'react'

const I18nContext = React.createContext({ lang: null })

export function I18nContextProvider({ lang, children }) {
  const value = React.useMemo(() => ({ lang }), [lang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useLang() {
  const { lang } = React.useContext(I18nContext)
  return lang
}
