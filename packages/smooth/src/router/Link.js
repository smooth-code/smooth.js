import React from 'react'
import { Link as BaseLink, NavLink as BaseNavLink } from 'react-router-dom'
import { formatLangUrl, useLang } from '../i18n'
import { HiddenLinkRouter } from './HiddenLinkRouter'
import { useIsRouterReady } from './CoreRouter'

function createLink(Component) {
  const Link = ({ waitBeforeTransition, onClick, ...props }) => {
    const routerReady = useIsRouterReady()
    const lang = useLang()
    const to = formatLangUrl(props.to, lang)
    const handleClick = React.useCallback(
      event => {
        if (onClick) {
          onClick(event)
        }
        if (!routerReady) {
          event.preventDefault()
          // eslint-disable-next-line
          window.location = to
        }
      },
      [to, routerReady, onClick],
    )
    const link = <Component {...props} to={to} onClick={handleClick} />

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
