import gql from 'graphql-tag'

export const typeDefs = gql`
  type Mutation {
    ping: Boolean
  }
`

export const resolvers = {
  Mutation: {
    ping: () => true,
  },
}
