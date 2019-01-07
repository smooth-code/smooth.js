export function indexByKey(items) {
  return items.reduce((obj, item) => {
    obj[item.key] = item
    return obj
  }, {})
}
