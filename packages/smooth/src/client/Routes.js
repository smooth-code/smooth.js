import React from 'react'
import { Switch, Route } from '../router'
import Page, { getPages } from '../page/Page'
import { HiddenRouter } from '../router/HiddenRouter'

const pages = getPages()

export default function Routes({ match: { url } }) {
  const routes = (
    <Switch>
      {pages.map((page, index) => (
        <Route
          key={index}
          path={`${url}${page.routePath}`.replace(/\/\//, '/')}
          render={({ history, match, location }) => (
            <Page
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
}
