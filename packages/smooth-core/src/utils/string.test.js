import { humanize, pluralize, singularize } from './string'

describe('string utils', () => {
  describe('#humanize', () => {
    it('should humanize a string', () => {
      expect(humanize('AwesomeBook')).toBe('Awesome book')
    })
  })

  describe('#pluralize', () => {
    it('should pluralize a string', () => {
      expect(pluralize('book')).toBe('books')
      expect(pluralize('awesome book')).toBe('awesome books')
    })
  })

  describe('#singularize', () => {
    it('should singularize a string', () => {
      expect(singularize('books')).toBe('book')
      expect(singularize('awesome books')).toBe('awesome book')
    })
  })
})
