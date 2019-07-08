import { parseHeaders } from './smooth-node'

describe('Smooth Header Plugin', () => {
  describe('parseHeaders', () => {
    it('should parse to empty array by default', () => {
      expect(parseHeaders()).toEqual([])
    })

    it('should parse Cache-control on matching (.*)', () => {
      expect(
        parseHeaders('/page/home', { '(.*)': ['Cache-Control: no-cache'] }),
      ).toEqual([['Cache-Control', 'no-cache']])
    })

    it('should not parse Cache-control on non matching /page/(.*) url', () => {
      expect(
        parseHeaders('/home', { '/page/(.*)': ['Cache-Control: no-cache'] }),
      ).toEqual([])
    })

    it('should parse Cache-control only on matching /home url', () => {
      expect(
        parseHeaders('/home', {
          '/page/(.*)': ['Cache-Control: no-cache'],
          '/home': ['Cache-Control: public, max-age=31557600'],
        }),
      ).toEqual([['Cache-Control', 'public, max-age=31557600']])
    })

    it('should parse all headers rules that match with url', () => {
      expect(
        parseHeaders('/home', {
          '/(.*)': ['Cache-Control: no-cache'],
          '/home': ['Basic-Auth: user:passwd'],
        }),
      ).toEqual([['Cache-Control', 'no-cache'], ['Basic-Auth', 'user:passwd']])
    })

    it('should overwrite same rules', () => {
      expect(
        parseHeaders('/favicon.ico', {
          '/(.*)': ['Cache-Control: no-cache'],
          '/(.*).ico': ['Cache-Control: public, max-age=2592000'],
        }),
      ).toEqual([['Cache-Control', 'public, max-age=2592000']])
    })
  })
})
