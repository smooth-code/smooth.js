import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Page, { getPages } from './Page'
import HiddenRouter from '../router/HiddenRouter'
import { Provider as HiddenHistoryContextProvider } from '../router/HiddenHistoryContext'

const pages = getPages()

export default function Routes() {
  return (
    <HiddenHistoryContextProvider>
      <Route
        path="/:lang(.{2})?"
        render={({
          match: {
            url,
            params: { lang = null },
          },
        }) => {
          const routes = (
            <Switch>
              {pages.map((page, index) => (
                <Route
                  key={index}
                  path={`${url}${page.routePath}`}
                  render={({ history, match, location }) => (
                    <Page
                      lang={lang}
                      indexUrl={`${url}${page.indexPath}`}
                      page={page}
                      history={history}
                      match={match}
                      location={location}
                    />
                  )}
                />
              ))}
            </Switch>
          )
          return (
            <>
              {routes}
              <HiddenRouter>{routes}</HiddenRouter>
            </>
          )
        }}
      />
    </HiddenHistoryContextProvider>
  )
}
