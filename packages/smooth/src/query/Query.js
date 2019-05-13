import React from 'react'
import { Query as ApolloQuery } from 'react-apollo'
import { useOperationProps } from './utils'

export function Query({ prefetch = true, ...props }) {
  const operationProps = useOperationProps({ prefetch, ...props })
  return <ApolloQuery {...operationProps} />
}
