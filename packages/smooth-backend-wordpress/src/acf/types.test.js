import * as types from './types'

describe('types', () => {
  describe('#fieldGroupLocation', () => {
    it('should return a field group location', () => {
      expect(types.fieldGroupLocation('value')).toEqual([
        [{ operator: '==', param: 'post_type', value: 'value' }],
      ])
    })
  })

  describe('#key', () => {
    it('should return a key', () => {
      expect(types.key('type', 'value')).toEqual('sc_type_value')
    })
  })

  describe('#fieldGroup', () => {
    it('should return a field group', () => {
      expect(types.fieldGroup('name', [], [])).toEqual({
        fields: [],
        hide_on_screen: [
          'the_content',
          'excerpt',
          'discussion',
          'comments',
          'revisions',
          'slug',
          'author',
          'format',
          'page_attributes',
          'featured_image',
          'categories',
          'tags',
          'send-trackbacks',
        ],
        key: 'sc_field_group_name',
        location: [],
        position: 'acf_after_title',
        style: 'seamless',
        title: 'name',
      })
    })
  })

  describe('#layout', () => {
    it('should return a layout', () => {
      expect(types.layout('id', 'name', [], { label: 'Layout' })).toEqual({
        key: 'sc_layout_id',
        label: 'Layout',
        name: 'name',
        sub_fields: [],
      })
    })
  })

  describe('#field', () => {
    it('should return a field', () => {
      expect(types.field('id', 'name', { type: 'flexible_content' })).toEqual({
        key: 'sc_field_id',
        label: 'name',
        name: 'name',
        type: 'flexible_content',
      })
    })
  })
})
