import path from 'path'
import { generateConfig } from './config'
import * as types from './types'
import { writeFile, getPluginDir } from '../util'

export async function onBuild({ schemaDefinition, types: gqlTypes, options }) {
  const cptConfig = generateConfig(schemaDefinition.typeDefs, {
    gql: gqlTypes,
    cpt: types,
  })

  const pluginDir = await getPluginDir(options.basePath)
  const cptConfigPath = path.join(pluginDir, 'cpt.json')

  await writeFile(cptConfigPath, JSON.stringify(cptConfig, null, 2))
}
