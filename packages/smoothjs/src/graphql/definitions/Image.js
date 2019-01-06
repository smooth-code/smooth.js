import gql from 'graphql-tag'

export const typeDefs = gql`
  type ImageSize {
    width: Int!
    height: Int!
    url: String!
  }

  type Image {
    id: ID!
    url: String!
    mimeType: String!
    alt: String
    title: String
    thumbnail: ImageSize!
    medium: ImageSize!
    large: ImageSize!
  }
`
