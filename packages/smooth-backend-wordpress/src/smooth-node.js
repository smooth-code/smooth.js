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

export function onCreateSchemaDefinition(params) {
  acf.onCreateSchemaDefinition(params)
}

export async function onBuild(params) {
  await Promise.all([
    acf.onBuild(params),
    cpt.onBuild(params),
    wordpress.onBuild(params),
  ])
}

export async function getContent(params) {
  return acf.getContent(params)
}

export async function getContents(params) {
  return acf.getContents(params)
}
