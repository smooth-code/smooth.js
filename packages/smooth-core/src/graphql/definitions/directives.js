import gql from 'graphql-tag'

export const typeDefs = gql`
  enum FieldType {
    shortText
    longText
    richText
  }

  directive @block on OBJECT
  directive @field(type: FieldType, label: String) on FIELD_DEFINITION
  directive @model(icon: String, slug: String, label: String) on OBJECT
`
