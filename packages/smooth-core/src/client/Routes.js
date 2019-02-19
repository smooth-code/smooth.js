import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Page, { getPages } from './Page'

const pages = getPages()

export default function Routes() {
  return (
    <Route
      path="/:lang(.{2})?"
      render={({
        match: {
          url,
          params: { lang = null },
        },
      }) => (
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
      )}
    />
  )
}
