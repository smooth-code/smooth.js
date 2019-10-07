import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import rawMkdirp from 'mkdirp'
import { ncp } from 'ncp'

export const writeFile = promisify(fs.writeFile)
export const mkdirp = promisify(rawMkdirp)
export async function copyDir(source, destination, options) {
  return new Promise((resolve, reject) => {
    ncp(source, destination, options, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export async function getPluginDir(basePath) {
  const pluginDir = path.join(basePath, 'wp-content/plugins/smooth-js')
  await mkdirp(pluginDir)
  return pluginDir
}

export async function getThemeDir(basePath) {
  const pluginDir = path.join(basePath, 'wp-content/themes/smooth-js')
  await mkdirp(pluginDir)
  return pluginDir
}
