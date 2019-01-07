import React from 'react'
import ErrorPage from '__smooth_error'
import Status from './router/Status'

export default class ErrorBoundary extends React.Component {
  state = { error: this.props.error }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    const { error } = this.state

    if (error) {
      return (
        <Status code={error.statusCode}>
          <ErrorPage error={error} />
        </Status>
      )
    }

    return this.props.children
  }
}
