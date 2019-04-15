import path from 'path'
import { mergeResolvers } from 'smooth/graphql'
import { createResolvers } from './resolvers'
import { generateConfig } from './config'
import * as types from './types'
import { createClient } from './api'
import { writeFile, getPluginDir } from '../util'

export function onCreateSchemaDefinition(params, options) {
  const acfResolvers = createResolvers(params, options)
  params.schemaDefinition.resolvers = mergeResolvers(
    params.schemaDefinition.resolvers,
    acfResolvers,
  )
}

export async function onBuild({ schemaDefinition, types: gqlTypes }, options) {
  const acfConfig = await generateConfig(schemaDefinition.typeDefs, {
    gql: gqlTypes,
    acf: types,
  })

  const pluginDir = await getPluginDir(options.basePath)
  const acfConfigPath = path.join(pluginDir, 'acf.json')

  await writeFile(acfConfigPath, JSON.stringify(acfConfig, null, 2))
}

export async function getContent({ request }, options) {
  const apiClient = createClient(options)
  return apiClient.getContent(request)
}

export async function getContents({ request }, options) {
  const apiClient = createClient(options)
  return apiClient.getContents(request)
}
