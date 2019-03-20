import React from 'react'
import { Link as BaseLink, NavLink as BaseNavLink } from 'react-router-dom'
import { useLang } from '../page/PageContext'
import HiddenLinkRouter from './HiddenLinkRouter'

function computeTo(to, lang) {
  if (lang) {
    return `/${lang}${to}`
  }
  return to
}

function createLink(Component) {
  const Link = ({ waitBeforeTransition, ...props }) => {
    const lang = useLang()
    const link = <Component {...props} to={computeTo(props.to, lang)} />

    return waitBeforeTransition ? (
      <HiddenLinkRouter>{link}</HiddenLinkRouter>
    ) : (
      link
    )
  }

  Link.displayName = `enhanced(${Component.name})`
  return Link
}

export const Link = createLink(BaseLink)
export const NavLink = createLink(BaseNavLink)
