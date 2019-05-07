import React from 'react'
import { Router, useRouter } from './Router'
import { useMixedHiddenHistory } from './HiddenHistory'

export function HiddenLinkRouter({ children }) {
  const { history } = useRouter()
  const hiddenHistory = useMixedHiddenHistory(history)
  return <Router history={hiddenHistory}>{children}</Router>
}
