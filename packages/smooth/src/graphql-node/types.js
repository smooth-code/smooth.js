import slugify from 'slugify'
import { shallowEqual } from '../utils'

// Validators

export function is(kind, node, opts) {
  if (!node) return false

  const matches = node.kind === kind
  if (!matches) return false

  if (typeof opts === 'undefined') {
    return true
  }

  return shallowEqual(node, opts)
}

export const isName = is.bind(null, 'Name')
export const isFieldDefinition = is.bind(null, 'FieldDefinition')
export const isObjectTypeDefinition = is.bind(null, 'ObjectTypeDefinition')
export const isEnumTypeDefinition = is.bind(null, 'EnumTypeDefinition')
export const isUnionTypeDefinition = is.bind(null, 'UnionTypeDefinition')
export const isDirective = is.bind(null, 'Directive')
export const isArgument = is.bind(null, 'Argument')
export const isNonNullType = is.bind(null, 'NonNullType')
export const isListType = is.bind(null, 'ListType')
export const isNamedType = is.bind(null, 'NamedType')

export const hasDirective = (node, test) => {
  if (!node.directives) return null
  return node.directives.find(
    directive => isDirective(directive) && test(directive),
  )
}

// Getters

export function getName(node) {
  return node.name.value
}

export function getValue(node) {
  return node.value.value
}

export function getDirective(node, name) {
  if (!node.directives) return null
  return node.directives.find(
    directive =>
      isDirective(directive) && isName(directive.name, { value: name }),
  )
}

export function getArg(node, name) {
  if (!node.arguments) return null
  return node.arguments.find(
    arg => isArgument(arg) && isName(arg.name, { value: name }),
  )
}

export function getArgv(node, name) {
  const arg = getArg(node, name)
  return arg ? getValue(arg) : null
}

export function getContentSlug(node) {
  const contentDirective = getDirective(node, 'content')
  if (!contentDirective) return null
  const slugArgument = getArg(contentDirective, 'slug')
  return slugArgument
    ? getValue(slugArgument)
    : slugify(getName(node), { lower: true })
}

export function resolveType(type) {
  return isNonNullType(type) ? type.type : type
}

export function findTypeDefinition(node, docNode) {
  return docNode.definitions.find(
    defNode =>
      (isObjectTypeDefinition(defNode) ||
        isEnumTypeDefinition(defNode) ||
        isUnionTypeDefinition(defNode)) &&
      isName(defNode.name, { value: node.name.value }),
  )
}

export function getKnownType(type) {
  switch (type.name.value) {
    case 'String':
      return 'shortText'
    case 'Image':
      return 'image'
    case 'Media':
      return 'media'
    case 'Link':
      return 'link'
    case 'Boolean':
      return 'boolean'
    case 'Int':
      return 'integer'
    case 'Float':
      return 'float'
    case 'Date':
      return 'date'
    case 'DateTime':
      return 'dateTime'
    case 'Time':
      return 'time'
    case 'Block':
      return 'block'
    default:
      return null
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function getFieldType(type, directive, ast) {
  const fieldType = directive ? getArgv(directive, 'type') : null
  if (fieldType) return { name: fieldType, typeNode: type }
  const knownType = getKnownType(type)
  if (knownType) return { name: knownType, typeNode: type }
  const typeDefinition = findTypeDefinition(type, ast)
  if (!typeDefinition) return null

  if (isObjectTypeDefinition(typeDefinition)) {
    const content = getContentSlug(typeDefinition)
    if (content) {
      return {
        name: 'relation',
        content,
        typeNode: type,
        typeDefinitionNode: typeDefinition,
      }
    }
    return {
      name: 'object',
      typeNode: type,
      typeDefinitionNode: typeDefinition,
    }
  }
  if (isEnumTypeDefinition(typeDefinition)) {
    return { name: 'enum', typeNode: type, typeDefinitionNode: typeDefinition }
  }
  if (isUnionTypeDefinition(typeDefinition)) {
    return {
      name: 'union',
      typeNode: type,
      typeDefinitionNode: typeDefinition,
      types: typeDefinition.types.map(subType =>
        getFieldType(subType, null, ast),
      ),
    }
  }
  return null
}

export function getFieldInfos(node, ast) {
  const directive = getDirective(node, 'field')
  if (!directive) return null

  const required = isNonNullType(node.type)
  const name = getName(node)
  const label = getArgv(directive, 'label') || capitalizeFirstLetter(name)

  let type = resolveType(node.type)

  const list = isListType(type)

  if (list) {
    type = resolveType(type.type)
  }

  const fieldType = getFieldType(type, directive, ast)

  if (!fieldType) {
    throw new Error(`Uncompatible field "${name}"`)
  }

  return {
    name,
    label,
    description: node.description ? node.description.value : null,
    required,
    list,
    type: fieldType,
  }
}
