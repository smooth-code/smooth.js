/* eslint-disable no-restricted-syntax */
import { realpathSync } from 'fs'

function deleteCache(path) {
  try {
    delete require.cache[realpathSync(path)]
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  } finally {
    delete require.cache[path]
  }
}

// This plugin flushes require.cache after emitting the files. Providing 'hot reloading' of server files.
export default class SmoothRequireCacheHotReloader {
  prevAssets = null

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      'SmoothRequireCacheHotReloader',
      (compilation, callback) => {
        const { assets } = compilation

        if (this.prevAssets) {
          for (const f of Object.keys(assets)) {
            deleteCache(assets[f].existsAt)
          }
          for (const f of Object.keys(this.prevAssets)) {
            if (!assets[f]) {
              deleteCache(this.prevAssets[f].existsAt)
            }
          }
        }
        this.prevAssets = assets

        callback()
      },
    )
  }
}
