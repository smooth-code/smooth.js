import React, { createContext, useContext } from 'react'
import { StaticRouter, withRouter } from 'react-router-dom'
import HiddenHistoryContext from './HiddenHistoryContext'

export const HiddenRouterContext = createContext()

function HiddenRouter({ history, children }) {
  const hiddenHistory = useContext(HiddenHistoryContext)
  return hiddenHistory.location ? (
    <div style={{ display: 'none' }} hidden>
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
    </div>
  ) : null
}

export default withRouter(HiddenRouter)
