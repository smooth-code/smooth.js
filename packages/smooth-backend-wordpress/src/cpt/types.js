export function postType(name, label = null, icon = null) {
  return {
    name,
    config: {
      label,
      public: true,
      show_in_rest: true,
      menu_icon: icon,
      supports: ['title', 'editor', 'revisions'],
    },
  }
}
