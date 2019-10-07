import React from 'react'
import { Router, useHistory } from './Router'
import { useMixedHiddenHistory } from './HiddenHistory'

export function HiddenLinkRouter({ children }) {
  const history = useHistory()
  const hiddenHistory = useMixedHiddenHistory(history)
  return <Router history={hiddenHistory}>{children}</Router>
}
