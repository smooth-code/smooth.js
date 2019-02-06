import React from 'react'
import { Link as BaseLink } from 'react-router-dom'
import PageContext from './PageContext'

function computeTo(to, lang) {
  if (lang) {
    return `/${lang}${to}`
  }
  return to
}

export default function Link(props) {
  return (
    <PageContext.Consumer>
      {({ lang }) => <BaseLink {...props} to={computeTo(props.to, lang)} />}
    </PageContext.Consumer>
  )
}
