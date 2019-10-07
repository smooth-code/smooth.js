import { execute } from 'graphql/execution'
import gql from 'graphql-tag'

const QUERY = gql`
  {
    __schema {
      types {
        kind
        name
        possibleTypes {
          name
        }
      }
    }
  }
`

export async function getFragmentTypes({ schema }) {
  const { data } = await execute(schema, QUERY)
  const filteredData = data.__schema.types.filter(
    type => type.possibleTypes !== null,
  )
  data.__schema.types = filteredData
  return data
}
