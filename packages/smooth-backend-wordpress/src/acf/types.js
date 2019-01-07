export function fieldGroupLocation(
  value,
  param = 'post_type',
  operator = '==',
) {
  return [
    [
      {
        param,
        operator,
        value,
      },
    ],
  ]
}

export function key(type, value) {
  return `sc_${type}_${value}`
}

export function fieldGroup(name, fields, location) {
  return {
    key: key('field_group', name),
    title: name,
    fields,
    location,
    position: 'acf_after_title',
    style: 'seamless',
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
  }
}

export function layout(id, name, subFields, opts = {}) {
  return {
    key: key('layout', id),
    name,
    label: name,
    sub_fields: subFields,
    ...opts,
  }
}

export function field(id, name, opts = {}) {
  return {
    key: key('field', id),
    name,
    label: name,
    ...opts,
  }
}
