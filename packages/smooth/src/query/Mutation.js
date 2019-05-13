import React from 'react'
import { Mutation as ApolloMutation } from 'react-apollo'
import { useOperationProps } from './utils'

export function Mutation(props) {
  const operationProps = useOperationProps(props)
  return <ApolloMutation {...operationProps} />
}
