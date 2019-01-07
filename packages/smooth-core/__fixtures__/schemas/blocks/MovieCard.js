import gql from 'graphql-tag'

export const typeDefs = gql`
  type MovieCard @block {
    title: String! @field
    movie: Movie! @field
  }
`
