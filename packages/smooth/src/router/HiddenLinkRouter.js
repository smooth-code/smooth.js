import React, { useContext, useRef } from 'react'
import { withRouter, Router } from 'react-router-dom'
import HiddenHistoryContext from './HiddenHistoryContext'

// Create a local history, a mix with original history & hiddenHistory
function useHiddenHistory(originalHistory) {
  const hiddenHistory = useContext(HiddenHistoryContext)
  const mixedHistory = useRef({})
  Object.assign(mixedHistory.current, originalHistory)
  mixedHistory.current.push = hiddenHistory.push
  mixedHistory.current.replace = hiddenHistory.replace
  if (hiddenHistory.location) {
    mixedHistory.current.location = hiddenHistory.location
  }
  return mixedHistory.current
}

function HiddenLinkRouter({ history, children }) {
  const hiddenHistory = useHiddenHistory(history)
  return <Router history={hiddenHistory}>{children}</Router>
}

export default withRouter(HiddenLinkRouter)
