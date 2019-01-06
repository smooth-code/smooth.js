export function shallowEqual(actual, expected) {
  const keys = Object.keys(expected)

  for (const key of keys) {
    if (actual[key] !== expected[key]) {
      return false
    }
  }

  return true
}
