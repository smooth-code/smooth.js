import React from 'react'
import { Link as BaseLink, NavLink as BaseNavLink } from 'react-router-dom'
import { formatLangUrl, useLang } from '../i18n'
import { HiddenLinkRouter } from './HiddenLinkRouter'

function createLink(Component) {
  const Link = ({ waitBeforeTransition, ...props }) => {
    const lang = useLang()
    const to = formatLangUrl(props.to, lang)
    const link = <Component {...props} to={to} />

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
