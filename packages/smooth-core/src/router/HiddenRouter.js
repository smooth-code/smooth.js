import React, { createContext, useContext } from 'react'
import { StaticRouter, withRouter } from 'react-router-dom'
import HiddenHistoryContext from './HiddenHistoryContext'

export const HiddenRouterContext = createContext()

function HiddenRouter({ history, children }) {
  const hiddenHistory = useContext(HiddenHistoryContext)
  return (
    <div style={{ display: 'none' }}>
      {hiddenHistory.location && (
        <HiddenRouterContext.Provider
          value={{
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
          }}
        >
          <StaticRouter context={{}} location={hiddenHistory.location}>
            {children}
          </StaticRouter>
        </HiddenRouterContext.Provider>
      )}
    </div>
  )
}

export default withRouter(HiddenRouter)
