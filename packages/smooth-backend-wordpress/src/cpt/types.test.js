import * as types from './types'

describe('types', () => {
  describe('#postType', () => {
    it('should return a post type', () => {
      expect(types.postType('name', 'label', 'icon')).toEqual({
        config: {
          label: 'label',
          menu_icon: 'icon',
          public: true,
          show_in_rest: true,
          supports: ['title', 'editor', 'revisions'],
        },
        name: 'name',
      })
    })
  })
})
