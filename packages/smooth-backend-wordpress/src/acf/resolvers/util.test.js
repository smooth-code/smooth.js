import { toRelativeUrl, formatDate } from './util'

describe('util', () => {
  describe('#formatDate', () => {
    it('should format date', () => {
      expect(formatDate('1989-05-21').toJSON()).toBe('1989-05-21T00:00:00.000Z')
    })

    it('should return null if not a string (or empty)', () => {
      expect(formatDate(null)).toBe(null)
      expect(formatDate('')).toBe(null)
      expect(formatDate(undefined)).toBe(null)
    })
  })

  describe('#toRelativeUrl', () => {
    it('should support baseUrl without end slash', () => {
      expect(
        toRelativeUrl(
          'http://smooth-code.com',
          'http://smooth-code.com/foo/bar',
        ),
      ).toBe('/foo/bar')
    })

    it('should support baseUrl with end slash', () => {
      expect(
        toRelativeUrl(
          'http://smooth-code.com/',
          'http://smooth-code.com/foo/bar',
        ),
      ).toBe('/foo/bar')
    })

    it('should support root url (both endslash)', () => {
      expect(
        toRelativeUrl('http://smooth-code.com/', 'http://smooth-code.com/'),
      ).toBe('/')
    })

    it('should support root url (baseUrl endslash)', () => {
      expect(
        toRelativeUrl('http://smooth-code.com/', 'http://smooth-code.com'),
      ).toBe('/')
    })

    it('should support root url (url endslash)', () => {
      expect(
        toRelativeUrl('http://smooth-code.com', 'http://smooth-code.com/'),
      ).toBe('/')
    })

    it('should support root url (no endslash)', () => {
      expect(
        toRelativeUrl('http://smooth-code.com', 'http://smooth-code.com'),
      ).toBe('/')
    })

    it('should support url in param', () => {
      expect(
        toRelativeUrl(
          'http://smooth-code.com',
          'http://smooth-code.com/foo?url=http://smooth-code.com',
        ),
      ).toBe('/foo?url=http://smooth-code.com')
    })

    it('should avoid replacing url containing port', () => {
      expect(
        toRelativeUrl(
          'http://smooth-code.com',
          'http://smooth-code.com:8000/foo',
        ),
      ).toBe('http://smooth-code.com:8000/foo')
    })
  })
})
