import * as acf from './acf'
import * as cpt from './cpt'
import * as wordpress from './wordpress'

export function resolveOptions(options) {
  if (!options.baseUrl) {
    throw new Error('"baseUrl" is required')
  }

  if (!options.homeUrl && !process.env.WP_HOME) {
    throw new Error('"homeUrl" is required')
  }

  if (!options.homeUrl && process.env.WP_HOME) {
    options.homeUrl = process.env.WP_HOME
  }

  options.user = options.user || process.env.WP_USER || 'admin'
  options.password = options.password || process.env.WP_PASSWORD || 'admin'
  options.concurrency =
    Number(options.concurrency || process.env.SEED_CONCURRENCY) || 8

  return options
}

export function onCreateSchemaDefinition(params, options) {
  acf.onCreateSchemaDefinition(params, options)
}

export async function onBuild(params, options) {
  await Promise.all([
    acf.onBuild(params, options),
    cpt.onBuild(params, options),
    wordpress.onBuild(params, options),
  ])
}

export async function getContent(params, options) {
  return acf.getContent(params, options)
}

export async function getContents(params, options) {
  return acf.getContents(params, options)
}

export async function createMany(params, options) {
  return acf.createMany(params, options)
}

export async function truncate(params, options) {
  return acf.truncate(params, options)
}

export function createBackendPayload({ data, name, type }) {
  if (type === 'media') {
    return data
  }

  const { slug, ...fields } = data
  return { status: 'publish', slug, title: name, fields }
}
