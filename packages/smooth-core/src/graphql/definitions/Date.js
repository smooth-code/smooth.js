import gql from 'graphql-tag'
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date'

export const typeDefs = gql`
  scalar Date
  scalar DateTime
`

export const resolvers = {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
}
