import { gql, createSchemaDefinitionMock, types } from 'smooth/graphql'
import { generateConfig } from '.'
import * as acfTypes from '../types'

const helpers = { gql: types, acf: acfTypes }

function parse(typeDefs) {
  return createSchemaDefinitionMock({ typeDefs }).typeDefs
}

describe('#generateConfig', () => {
  it('should handle content', () => {
    const typeDef = gql`
      type Book @content {
        name: String! @field
      }
    `

    const ast = parse(typeDef)
    const [fieldGroup] = generateConfig(ast, helpers)
    expect(fieldGroup.key).toBe('sc_field_group_Book')
    expect(fieldGroup.title).toBe('Book')
    expect(fieldGroup.fields).toHaveLength(1)
    expect(fieldGroup.location).toEqual([
      [{ operator: '==', param: 'post_type', value: 'book' }],
    ])
  })

  describe('fields', () => {
    test.each([
      ['String @field', { type: 'text', required: 0 }],
      ['String! @field', { type: 'text', required: 1 }],
      ['[String] @field', { type: 'textarea' }],
      ['String @field(type: shortText)', { type: 'text' }],
      ['String @field(type: longText)', { type: 'textarea' }],
      [
        'String @field(type: richText)',
        { type: 'wysiwyg', media_upload: 0, toolbar: 'basic' },
      ],
      ['Boolean @field', { type: 'true_false' }],
      ['Date @field', { type: 'date_picker' }],
      ['DateTime @field', { type: 'date_time_picker' }],
      ['Int @field', { type: 'number' }],
      ['Float @field', { type: 'number' }],
      ['Image @field', { type: 'image' }],
      ['Media @field', { type: 'file' }],
      ['[Image] @field', { type: 'gallery' }],
      ['Link @field', { type: 'link' }],
      [
        'Enum @field',
        {
          type: 'select',
          allow_null: 1,
          choices: { a: 'a', b: 'b' },
          multiple: 0,
        },
      ],
      [
        'Enum! @field',
        {
          type: 'select',
          allow_null: 0,
          choices: { a: 'a', b: 'b' },
          multiple: 0,
          required: 1,
        },
      ],
      [
        'OtherContent @field',
        {
          type: 'post_object',
          post_type: ['othercontent'],
        },
      ],
      [
        'OtherType @field',
        {
          type: 'group',
          button_label: null,
          sub_fields: [
            {
              instructions: null,
              key: 'sc_field_contents_Content_field_foo',
              label: 'Foo',
              name: 'foo',
              required: 0,
              type: 'text',
            },
          ],
        },
      ],
    ])('%s', (value, expected) => {
      const typeDef = gql`
        type Content @content {
          field: ${value}
        }

        enum Enum {
          a
          b
        }

        type OtherType {
          foo: String @field
        }

        type OtherContent @content {
          foo: String @field
        }
      `
      const ast = parse(typeDef)
      const [fieldGroup] = generateConfig(ast, helpers)
      const [field] = fieldGroup.fields
      expect(field).toEqual({
        name: 'field',
        label: 'Field',
        key: 'sc_field_contents_Content_field',
        instructions: null,
        required: 0,
        ...expected,
      })
    })
  })
})
