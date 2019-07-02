import { toRelativeUrl, formatDate, formatDateTime, formatTime } from './util'

describe('util', () => {
  describe('#formatDate', () => {
    it('should format date', () => {
      expect(formatDate('21/05/1989').toJSON()).toBe('1989-05-21T00:00:00.000Z')
    })

    it('should return null if not a string (or empty)', () => {
      expect(formatDate(null)).toBe(null)
      expect(formatDate('')).toBe(null)
      expect(formatDate(undefined)).toBe(null)
    })
  })

  describe('#formatDateTime', () => {
    it('should format datetime', () => {
      expect(formatDateTime('21/05/1989 02:00 am').toJSON()).toBe(
        '1989-05-21T02:00:00.000Z',
      )
    })

    it('should return null if not a string (or empty)', () => {
      expect(formatDateTime(null)).toBe(null)
      expect(formatDateTime('')).toBe(null)
      expect(formatDateTime(undefined)).toBe(null)
    })
  })

  describe('#formatTime', () => {
    it('should format time', () => {
      expect(formatTime('2:30 am')).toBe('02:30:00Z')
      expect(formatTime('7:45 pm')).toBe('19:45:00Z')
      expect(formatTime('12:15 pm')).toBe('00:15:00Z')
    })

    it('should return null if not a string (or empty)', () => {
      expect(formatTime(null)).toBe(null)
      expect(formatTime('')).toBe(null)
      expect(formatTime(undefined)).toBe(null)
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
