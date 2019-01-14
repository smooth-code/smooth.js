import path from 'path'
import fs from 'fs'
import { writeFile, getPluginDir, getThemeDir, copyDir } from '../util'

const pluginDir = path.join(__dirname, 'plugin')
const themeDir = path.join(__dirname, 'theme')

const pluginTpl = fs.readFileSync(path.join(pluginDir, 'index.php'), 'utf-8')
const themeTpl = fs.readFileSync(path.join(themeDir, 'index.php'), 'utf-8')

export async function onBuild({ options, config }) {
  const pluginDistDir = await getPluginDir(options.basePath)
  const pluginContent = pluginTpl.replace(/%BASE_URL%/g, config.baseUrl)
  const pluginPath = path.join(pluginDistDir, 'index.php')
  await writeFile(pluginPath, pluginContent)

  const themeDistDir = await getThemeDir(options.basePath)
  const themeContent = themeTpl.replace(/%BASE_URL%/g, config.baseUrl)
  const themePath = path.join(themeDistDir, 'index.php')
  await copyDir(themeDir, themeDistDir, {
    filter: filename => !/index\.php/.test(filename),
  })
  await writeFile(themePath, themeContent)
}
