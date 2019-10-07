import { useMutation as useApolloMutation } from '@apollo/react-hooks'
import { useOperationHeaders } from './utils'

export function useMutation(mutation, options) {
  const headers = useOperationHeaders()
  const apolloOptions = { headers, ...options }
  const result = useApolloMutation(mutation, apolloOptions)
  return result
}
