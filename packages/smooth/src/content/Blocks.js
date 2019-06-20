import React from 'react'
import gql from 'graphql-tag'
import {
  getFragment,
  getFragmentDefinition,
  getFragmentString,
  getComponent,
  getDefinitionType,
  getDefinitionName,
} from './util'

function getBlock(filePath, exp) {
  const fragment = getFragment(exp, 'blockFragment', filePath)
  const fragmentDefinition = getFragmentDefinition(fragment)
  const Component = getComponent(exp, filePath)
  const type = getDefinitionType(fragmentDefinition)
  const name = getDefinitionName(fragmentDefinition)
  const propsAttribute = `${type}_props`
  const propsQuery = `${propsAttribute} { ...${name} }`

  return {
    type,
    Component,
    fragment,
    propsAttribute,
    propsQuery,
  }
}

function getBlocks() {
  const req = require.context(
    process.env.__smooth_blocks,
    true,
    /\.js$/,
    'sync',
  )
  return req.keys().map(filePath => getBlock(filePath, req(filePath)))
}

const blocks = getBlocks()
const blocksByType = blocks.reduce((obj, block) => {
  obj[block.type] = block
  return obj
}, {})

export const BlockFragment = gql`
  fragment BlockFragment on Block {
    type
    ${blocks.map(block => block.propsQuery).join('')}
  }

  ${blocks.map(block => getFragmentString(block.fragment)).join('')}
`

export function Blocks({ blocks: blocksProp, ...other }) {
  if (!blocksProp) return null
  return blocksProp.map(({ type, ...props }, index) => {
    const block = blocksByType[type]
    if (!block) {
      throw new Error(`Block "${type}" is not found`)
    }

    return (
      <block.Component
        key={index}
        {...props[block.propsAttribute]}
        {...other}
      />
    )
  })
}
