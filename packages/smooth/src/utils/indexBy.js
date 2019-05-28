export function indexBy(prop, items, selector = x => x) {
  return items.reduce(
    (result, item, index) => ({
      ...result,
      [prop(item, index)]: selector(item),
    }),
    {},
  )
}
