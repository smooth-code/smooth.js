import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { generateConfig } from './config'
import * as types from './types'

const writeFile = promisify(fs.writeFile)

export async function onBuild({ schemaDefinition, types: gqlTypes, options }) {
  const cptConfig = generateConfig(schemaDefinition.typeDefs, {
    gql: gqlTypes,
    cpt: types,
  })

  const cptConfigPath = path.join(
    options.basePath,
    'wp-content/plugins/smooth-cms/cpt.json',
  )

  await writeFile(cptConfigPath, JSON.stringify(cptConfig, null, 2))
}
