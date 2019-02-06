import React from 'react'
import { Link as BaseLink, NavLink as BaseNavLink } from 'react-router-dom'
import PageContext from './PageContext'

function computeTo(to, lang) {
  if (lang) {
    return `/${lang}${to}`
  }
  return to
}

function createLink(Component) {
  return props => (
    <PageContext.Consumer>
      {pageContext => (
        <Component
          {...props}
          to={computeTo(props.to, pageContext ? pageContext.lang : null)}
        />
      )}
    </PageContext.Consumer>
  )
}

export const Link = createLink(BaseLink)
export const NavLink = createLink(BaseNavLink)
