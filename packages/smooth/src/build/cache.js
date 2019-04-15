import fs from 'fs'
import path from 'path'
import rawMkdirp from 'mkdirp'
import util from 'util'

const writeFile = util.promisify(fs.writeFile)
const mkdirp = util.promisify(rawMkdirp)

export function createCache({ config }) {
  return {
    async writeCacheFile(filePath, content) {
      await mkdirp(config.cachePath)
      await writeFile(path.join(config.cachePath, filePath), content)
    },
    async createDirectory(dirPath) {
      await mkdirp(path.join(config.cachePath, dirPath))
    },
  }
}
