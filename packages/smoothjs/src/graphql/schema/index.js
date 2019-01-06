import merge from 'merge-deep'
import path from 'path'
import glob from 'tiny-glob'
import { concatenateTypeDefs, makeExecutableSchema } from 'graphql-tools'
import { parse } from 'graphql'
import { definitions as baseDefinitions } from '../definitions'
import { addBlockTypeDefinitions } from './blockType'
import { addModelTypeDefinitions } from './modelType'
import { applyAsyncHook } from '../../plugin'

function sanitizeDefinition(options) {
  return {
    typeDefs: options.typeDefs || null,
    resolvers: options.resolvers || {},
  }
}

function mergeSchemaDefinitions(definitions) {
  return {
    typeDefs: parse(
      concatenateTypeDefs(definitions.map(def => def.typeDefs).filter(Boolean)),
    ),
    resolvers: merge(...definitions.map(def => def.resolvers)),
  }
}

export async function getDefinitionModules({ config }) {
  const files = await glob('**/*.js', { cwd: config.schemasPath })
  return files.map(relativePath => {
    const absolutePath = path.join(config.schemasPath, relativePath)
    if (!config.cache) {
      delete require.cache[absolutePath]
    }
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(absolutePath)
  })
}

export function createSchemaDefinitionMock(...definitions) {
  const schemaDefinition = mergeSchemaDefinitions(
    [...baseDefinitions, ...definitions].map(sanitizeDefinition),
  )
  addBlockTypeDefinitions(schemaDefinition)
  addModelTypeDefinitions(schemaDefinition)
  return schemaDefinition
}

export async function createSchemaDefinition({ config }) {
  const projectDefinitions = await getDefinitionModules({ config })
  const schemaDefinition = mergeSchemaDefinitions(
    [...baseDefinitions, ...projectDefinitions].map(sanitizeDefinition),
  )
  addBlockTypeDefinitions(schemaDefinition)
  addModelTypeDefinitions(schemaDefinition)
  await applyAsyncHook(config, 'onCreateSchemaDefinition', { schemaDefinition })
  return schemaDefinition
}

export async function createSchema({ schemaDefinition }) {
  return makeExecutableSchema(schemaDefinition)
}

export { makeExecutableSchema }
