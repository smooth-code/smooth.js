import plugins from '__smooth_plugins'
import { hasHook, runHook, applyHook } from './browser'

jest.mock('__smooth_plugins', () => [
  {
    plugin: {
      hook: jest.fn(args => `${args.foo}-a`),
    },
  },
  {
    plugin: {
      hook: jest.fn(args => `${args.foo}-b`),
    },
  },
])

describe('browser plugins', () => {
  describe('#hasHook', () => {
    it('should return test if a plugin has a hook', () => {
      expect(hasHook({ plugin: { foo() {} } }, 'foo')).toBe(true)
      expect(hasHook({ plugin: { foo() {} } }, 'bar')).toBe(false)
    })
  })

  describe('#runHook', () => {
    it('should run a hook', () => {
      const plugin = { plugin: { hook: jest.fn() }, options: { foo: 'bar' } }
      runHook(plugin, 'hook', { args: true })
      expect(plugin.plugin.hook).toHaveBeenCalledTimes(1)
      expect(plugin.plugin.hook).toHaveBeenCalledWith(
        { args: true },
        { foo: 'bar' },
      )
    })
  })

  describe('#applyHook', () => {
    beforeEach(() => {
      plugins.forEach(plugin => {
        plugin.plugin.hook.mockClear()
      })
    })

    it('should run hooks without resultKey', () => {
      const result = applyHook('hook', { foo: 'bar' })
      expect(result).toBe(undefined)
      expect(plugins[0].plugin.hook).toHaveBeenCalledTimes(1)
      expect(plugins[1].plugin.hook).toHaveBeenCalledTimes(1)
    })

    it('should run hooks with resultKey', () => {
      const result = applyHook('hook', { foo: 'bar' }, 'foo')
      expect(result).toBe('bar-a-b')
      expect(plugins[0].plugin.hook).toHaveBeenCalledTimes(1)
      expect(plugins[1].plugin.hook).toHaveBeenCalledTimes(1)
    })
  })
})
