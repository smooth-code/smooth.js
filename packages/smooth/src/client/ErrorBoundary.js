import React from 'react'
import loadable from '@loadable/component'
import { Status } from '../router/Status'

const ErrorPage = loadable(() => import('__smooth_error'))

export default class ErrorBoundary extends React.Component {
  state = { error: this.props.error }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    const { error } = this.state

    if (error) {
      return (
        <Status code={error.statusCode || 500}>
          <ErrorPage lang={this.props.lang || null} error={error} />
        </Status>
      )
    }

    return this.props.children
  }
}
