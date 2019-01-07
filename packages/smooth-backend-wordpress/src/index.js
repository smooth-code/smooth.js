import * as acf from './acf'
import * as cpt from './cpt'

export function onCreateSchemaDefinition(params) {
  acf.onCreateSchemaDefinition(params)
}

export async function onBuild(params) {
  await Promise.all([acf.onBuild(params), cpt.onBuild(params)])
}

export async function getContent(params) {
  return acf.getContent(params)
}

export async function getContents(params) {
  return acf.getContents(params)
}
