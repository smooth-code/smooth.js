import React from 'react'
import { Link as BaseLink, NavLink as BaseNavLink } from 'react-router-dom'
import PageContext from '../client/PageContext'
import HiddenLinkRouter from './HiddenLinkRouter'

function computeTo(to, lang) {
  if (lang) {
    return `/${lang}${to}`
  }
  return to
}

function createLink(Component) {
  return ({ waitBeforeTransition, ...props }) => {
    const link = (
      <PageContext.Consumer>
        {pageContext => (
          <Component
            {...props}
            to={computeTo(props.to, pageContext ? pageContext.lang : null)}
          />
        )}
      </PageContext.Consumer>
    )

    return waitBeforeTransition ? (
      <HiddenLinkRouter>{link}</HiddenLinkRouter>
    ) : (
      link
    )
  }
}

export const Link = createLink(BaseLink)
export const NavLink = createLink(BaseNavLink)
