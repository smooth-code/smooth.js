import gql from 'graphql-tag'

export const typeDefs = gql`
  type Movie @model {
    title: String! @field
    description: String! @field
    link: Link! @field
    other: String!
  }
`

export const resolvers = {
  Movie: {
    other() {
      return 'other'
    },
  },
}
