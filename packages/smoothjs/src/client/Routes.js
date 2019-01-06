import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Content, { getContents } from './Content'

const contents = getContents()

export default function Routes() {
  return (
    <Switch>
      {contents.map(content => (
        <Route
          key={content.type}
          path={content.path}
          render={({
            location,
            match: {
              params: { slug, lang },
            },
          }) => (
            <Content
              type={content.type}
              component={content.component}
              fragment={content.fragment}
              lang={lang}
              location={location}
              slug={slug || 'index'}
            />
          )}
        />
      ))}
    </Switch>
  )
}
