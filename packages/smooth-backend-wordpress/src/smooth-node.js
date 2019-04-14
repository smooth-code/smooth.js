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
