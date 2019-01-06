import gql from 'graphql-tag'
import { generateConfig } from '.'
import { createSchemaDefinitionMock, types } from '../../../../graphql'
import * as acfTypes from '../types'

const helpers = { gql: types, acf: acfTypes }

function parse(typeDefs) {
  return createSchemaDefinitionMock({ typeDefs }).typeDefs
}

describe('#generateConfig', () => {
  it('should handle model', () => {
    const typeDef = gql`
      type Book @model {
        name: String! @field
      }
    `

    const ast = parse(typeDef)
    const [, fieldGroup] = generateConfig(ast, helpers)
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
        'OtherModel @field',
        {
          type: 'post_object',
          post_type: ['othermodel'],
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
              key: 'sc_field_models_Model_field_foo',
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
        type Model @model {
          field: ${value}
        }

        enum Enum {
          a
          b
        }

        type OtherType {
          foo: String @field
        }

        type OtherModel @model {
          foo: String @field
        }
      `
      const ast = parse(typeDef)
      const [, fieldGroup] = generateConfig(ast, helpers)
      const [field] = fieldGroup.fields
      expect(field).toEqual({
        name: 'field',
        label: 'Field',
        key: 'sc_field_models_Model_field',
        instructions: null,
        required: 0,
        ...expected,
      })
    })
  })

  // it('should convert types into config', () => {
  //   const typeDef = gql`
  //     type Header @block {
  //       name: String! @field
  //     }

  //     type Footer @block {
  //       name: String! @field
  //     }

  //     type Book @model {
  //       name: String! @field
  //     }
  //   `

  //   const ast = parse(typeDef)
  //   expect(generateConfig(ast, helpers)).toMatchSnapshot()
  // })

  // describe('simple', () => {
  //   it('should handle sub type', () => {
  //     const typeDef = gql`
  //       type MenuItem {
  //         title: String @field
  //         text: String @field
  //       }

  //       type Menu @model {
  //         item: MenuItem @field
  //       }
  //     `
  //     const ast = parse(typeDef)
  //     expect(generateConfig(ast, helpers)[1]).toMatchSnapshot()
  //   })

  //   it('should handle sub model', () => {
  //     const typeDef = gql`
  //       type MenuItem @model {
  //         title: String @field
  //         text: String @field
  //       }

  //       type Menu @model {
  //         item: MenuItem @field
  //       }
  //     `
  //     const ast = parse(typeDef)
  //     expect(generateConfig(ast, helpers)[2]).toMatchSnapshot()
  //   })

  //   it('should handle enum', () => {
  //     const typeDef = gql`
  //       enum MenuVariant {
  //         blue
  //         yellow
  //       }

  //       type Menu @model {
  //         variant: MenuVariant @field
  //       }
  //     `
  //     const ast = parse(typeDef)
  //     expect(generateConfig(ast, helpers)[1]).toMatchSnapshot()
  //   })
  // })

  // describe('array', () => {
  //   it('should handle sub type', () => {
  //     const typeDef = gql`
  //       type MenuItem {
  //         title: String @field
  //         text: String @field
  //       }

  //       type Menu @model {
  //         item: [MenuItem] @field
  //       }
  //     `
  //     const ast = parse(typeDef)
  //     expect(generateConfig(ast, helpers)[1]).toMatchSnapshot()
  //   })

  //   it('should handle sub model', () => {
  //     const typeDef = gql`
  //       type MenuItem @model {
  //         title: String
  //         text: String
  //       }

  //       type Menu @model {
  //         item: [MenuItem] @field
  //       }
  //     `
  //     const ast = parse(typeDef)
  //     expect(generateConfig(ast, helpers)[2]).toMatchSnapshot()
  //   })

  //   it('should handle enum', () => {
  //     const typeDef = gql`
  //       enum MenuVariant {
  //         blue
  //         yellow
  //       }

  //       type Menu @model {
  //         variant: [MenuVariant] @field
  //       }
  //     `
  //     const ast = parse(typeDef)
  //     expect(generateConfig(ast, helpers)[1]).toMatchSnapshot()
  //   })
  // })

  // it('should complex types', () => {
  //   const typeDef = gql`
  //     enum MenuItemAppearance {
  //       link
  //       button
  //     }

  //     type MenuItem {
  //       link: Link! @field
  //       appearance: MenuItemAppearance! @field
  //     }

  //     type Menu @model {
  //       items: [MenuItem!]! @field
  //     }
  //   `
  //   const ast = parse(typeDef)
  //   expect(generateConfig(ast, helpers)).toMatchSnapshot()
  // })
})
