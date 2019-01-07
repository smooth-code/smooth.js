import path from 'path'
import fs from 'fs'
import { promisify } from 'util'
import { mergeResolvers } from 'smooth-core/graphql'
import { createResolvers } from './resolvers'
import { generateConfig } from './config'
import * as types from './types'
import { createClient } from './api'

const writeFile = promisify(fs.writeFile)

export function onCreateSchemaDefinition(params) {
  const acfResolvers = createResolvers(params)
  params.schemaDefinition.resolvers = mergeResolvers(
    params.schemaDefinition.resolvers,
    acfResolvers,
  )
}

export async function onBuild({ schemaDefinition, options, types: gqlTypes }) {
  const acfConfig = await generateConfig(schemaDefinition.typeDefs, {
    gql: gqlTypes,
    acf: types,
  })

  const acfConfigPath = path.join(
    options.basePath,
    'wp-content/plugins/smooth-cms/acf.json',
  )

  await writeFile(acfConfigPath, JSON.stringify(acfConfig, null, 2))
}

export async function getContent({ request, options }) {
  const apiClient = createClient(options.baseUrl)
  return apiClient.getContent(request)
}

export async function getContents({ request, options }) {
  const apiClient = createClient(options.baseUrl)
  return apiClient.getContents(request)
}
