import React, { createContext, useContext, useMemo } from 'react'
import { StaticRouter, withRouter } from 'react-router-dom'
import HiddenHistoryContext from './HiddenHistoryContext'

export const HiddenRouterContext = createContext()

function HiddenRouter({ history, children }) {
  const hiddenHistory = useContext(HiddenHistoryContext)
  const value = useMemo(
    () => ({
      onPrefetched: () => {
        switch (hiddenHistory.action) {
          case 'PUSH':
            history.push(hiddenHistory.location)
            break
          case 'REPLACE':
            history.replace(hiddenHistory.location)
            break
          default:
            return
        }

        hiddenHistory.push(null)
      },
    }),
    [hiddenHistory, history],
  )
  const staticContext = useMemo(() => ({}))
  return hiddenHistory.location ? (
    <div style={{ display: 'none' }} hidden>
      <HiddenRouterContext.Provider value={value}>
        <StaticRouter context={staticContext} location={hiddenHistory.location}>
          {children}
        </StaticRouter>
      </HiddenRouterContext.Provider>
    </div>
  ) : null
}

export default withRouter(HiddenRouter)
