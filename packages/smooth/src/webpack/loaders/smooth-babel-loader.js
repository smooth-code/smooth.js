/* eslint-disable no-restricted-syntax */
import babelLoader from 'babel-loader'
import preset from '../../babel/preset'

module.exports = babelLoader.custom(babel => {
  const presetItem = babel.createConfigItem(preset, {
    type: 'preset',
  })

  const configs = new Set()

  return {
    customOptions(opts) {
      const custom = {
        isServer: opts.isServer,
        dev: opts.dev,
      }

      const loader = Object.assign(
        {
          cacheCompression: false,
          cacheDirectory: true,
        },
        opts,
      )

      delete loader.isServer
      delete loader.dev

      return { loader, custom }
    },
    config(
      cfg,
      {
        customOptions: { isServer },
      },
    ) {
      const options = Object.assign({}, cfg.options)
      if (cfg.hasFilesystemConfig()) {
        for (const file of [cfg.babelrc, cfg.config]) {
          // We only log for client compilation otherwise there will be double output
          if (file && !isServer && !configs.has(file)) {
            configs.add(file)
            // eslint-disable-next-line no-console
            console.log(`> Using external babel configuration`)
            // eslint-disable-next-line no-console
            console.log(`> Location: "${file}"`)
          }
        }
      } else {
        // Add our default preset if the no "babelrc" found.
        options.presets = [...options.presets, presetItem]
      }

      return options
    },
  }
})
