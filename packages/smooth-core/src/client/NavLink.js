import React from 'react'
import { NavLink as BaseNavLink } from 'react-router-dom'
import PageContext from './PageContext'

function computeTo(to, lang) {
  if (lang) {
    return `/${lang}${to}`
  }
  return to
}

export default function NavLink(props) {
  return (
    <PageContext.Consumer>
      {({ lang }) => <BaseNavLink {...props} to={computeTo(props.to, lang)} />}
    </PageContext.Consumer>
  )
}
