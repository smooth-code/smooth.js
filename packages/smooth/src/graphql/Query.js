import React from 'react'
import { useQuery as useApolloQuery } from '@apollo/react-hooks'
import { usePause } from '../router/HiddenRouter'
import { useOperationHeaders } from './utils'

export function useQuery(
  query,
  { prefetch = true, pageContent = false, ...options } = {},
) {
  const headers = useOperationHeaders({ pageContent })
  const apolloOptions = { headers, ...options }
  const result = useApolloQuery(query, apolloOptions)
  const unpause = usePause({ skip: options.skip || !prefetch })
  React.useEffect(() => {
    if (!result.loading && !options.skip) {
      unpause()
    }
  }, [unpause, result.loading, options.skip])
  return result
}
