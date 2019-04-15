import { createCache } from './cache'
import { buildBrowser } from './index'

jest.mock('./cache')

describe('#buildBrowser', () => {
  let cache

  beforeEach(() => {
    cache = {
      createDirectory: jest.fn(),
      writeCacheFile: jest.fn(),
    }
    createCache.mockImplementation(() => cache)
  })

  it('should build browser plugins', async () => {
    const config = {
      plugins: [
        {
          browser: true,
          resolve: '/a',
          options: { foo: 'bar' },
        },
        {
          browser: false,
          resolve: '/b',
          options: {},
        },
      ],
    }
    buildBrowser({ config })
    expect(cache.createDirectory).toHaveBeenCalledTimes(1)
    await Promise.resolve()
    expect(cache.writeCacheFile).toHaveBeenCalledTimes(1)
    const [[filename, content]] = cache.writeCacheFile.mock.calls
    expect(filename).toBe('browser-plugins.js')
    expect(content).toBe(
      'module.exports = [{ plugin: require(\'/a/smooth-browser\'), options: {"foo":"bar"} }]',
    )
  })
})
