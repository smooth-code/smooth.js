import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import util from 'util'

const writeFile = util.promisify(fs.writeFile)

export function createCache({ config }) {
  return {
    async writeCacheFile(filePath, content) {
      await mkdirp(config.cachePath)
      await writeFile(path.join(config.cachePath, filePath), content)
    },
  }
}
