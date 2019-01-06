import { shallowEqual } from './shallowEqual'

describe('shallowEqual', () => {
  it('should return true if expected is part of actual', () => {
    expect(shallowEqual({ a: '1', b: '2' }, { b: '2' })).toBe(true)
  })

  it('should return false if expected is not part of actual', () => {
    expect(shallowEqual({ a: '1', b: '2' }, { c: '3' })).toBe(false)
  })
})
