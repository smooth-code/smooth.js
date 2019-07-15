import gql from 'graphql-tag'

export const typeDefs = gql`
  enum TwitterCardType {
    summary_large_image
    summary
  }

  type CustomMeta {
    name: String @field(label: "Name")
    content: String @field(label: "Content")
  }

  type HeadMeta {
    title: String @field(label: "Title")
    description: String @field(label: "Description")
    "<a href='http://ogp.me' target='_blank'>Documentation</a>"
    ogType: String @field(label: "Open Graph Type")
    "<a href='http://ogp.me' target='_blank'>Documentation</a>"
    ogTitle: String @field(label: "Open Graph Title")
    "<a href='http://ogp.me' target='_blank'>Documentation</a>"
    ogDescription: String @field(label: "Open Graph Description")
    "<a href='http://ogp.me' target='_blank'>Documentation</a>"
    ogImage: Image @field(label: "Open Graph Image")
    twitterCard: TwitterCardType @field(label: "Twitter Card Type")
    twitterTitle: String @field(label: "Twitter title")
    twitterDescription: String @field(label: "Twitter description")
    twitterImage: Image @field(label: "Twitter image")
    customMetas: [CustomMeta] @field(label: "Custom metadatas")
    customJsonld: String @field(type: longText, label: "Paste valid JSON-LD here")
    "<a href='https://search.google.com/structured-data/testing-tool/u/0/' target='_blank'>JSON-LD validator</a>"
  }
`
