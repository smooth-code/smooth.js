import React, { useContext, useMemo } from 'react'
import { withRouter, Router } from 'react-router-dom'
import HiddenHistoryContext from './HiddenHistoryContext'

function HiddenLinkRouter({ history, children }) {
  const hiddenHistory = useContext(HiddenHistoryContext)
  const newHistory = useMemo(() => ({ ...history }), [history])
  newHistory.push = hiddenHistory.push
  return <Router history={newHistory}>{children}</Router>
}

export default withRouter(HiddenLinkRouter)
