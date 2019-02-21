import gql from 'graphql-tag'

export const typeDefs = gql`
  enum TwitterCardType {
    summary_large_image
    summary
  }

  type CustomMeta {
    name: String @field
    content: String @field
  }

  type HeadMeta {
    title: String @field
    description: String @field
    ogType: String @field
    ogTitle: String @field
    ogDescription: String @field
    ogImage: Image @field
    twitterCard: TwitterCardType @field
    twitterTitle: String @field
    twitterDescription: String @field
    twitterImage: Image @field
    customMetas: [CustomMeta] @field
  }
`
