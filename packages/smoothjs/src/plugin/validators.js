function assertExists(value, name, hookName) {
  if (!value) {
    throw new Error(`"${name}" missing in hook "${hookName}"`)
  }
}

export function onBuild({ schemaDefinition }) {
  assertExists(schemaDefinition)
}

export function onCreateSchemaDefinition({ schemaDefinition }) {
  assertExists(schemaDefinition)
}
