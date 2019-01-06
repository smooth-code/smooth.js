import React from 'react'
import gql from 'graphql-tag'

function getPropsAttribute(name) {
  return `${name}_props`
}

function getPropsQuery({ fragment, name }) {
  const propsFragmentDefinition = fragment.definitions.find(
    node =>
      node.kind === 'FragmentDefinition' &&
      node.typeCondition.kind === 'NamedType' &&
      node.typeCondition.name.value === name,
  )
  return /* GraphQL */ `
    ${getPropsAttribute(name)} {
      ...${propsFragmentDefinition.name.value}
    }
  `
}

function getBlocks() {
  const req = require.context(process.env.SMOOTH_BLOCKS_PATH, true, /\.js$/)
  return req
    .keys()
    .map(filePath => {
      const m = req(filePath)
      const { blockFragment: fragment = null, default: component } = m

      if (!fragment) return null

      const { name } = component
      const propsAttribute = getPropsAttribute(name)

      return {
        name,
        component,
        getFragmentString() {
          return fragment.loc.source.body
        },
        propsAttribute,
        propsQuery: fragment ? getPropsQuery({ fragment, name }) : null,
      }
    })
    .filter(Boolean)
}

const blocks = getBlocks()
const blocksByName = blocks.reduce((obj, block) => {
  obj[block.name] = block
  return obj
}, {})

export const blocksFragment = gql`
  fragment BlockFragment on Block {
    type
    ${blocks.map(({ propsQuery }) => propsQuery).join('\n')}
  }

  ${blocks.map(({ getFragmentString }) => getFragmentString()).join('\n')}
`

export default function Blocks({ blocks: blocksProp }) {
  return blocksProp.map(({ type, ...props }, index) => {
    const block = blocksByName[type]
    if (!block) {
      throw new Error(`Block "${type}" is not found`)
    }
    const Block = block.component
    return <Block key={index} {...props[block.propsAttribute]} />
  })
}
