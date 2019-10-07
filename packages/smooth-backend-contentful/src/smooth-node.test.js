import { applyAsyncHook } from 'smooth/plugin'
import { gql, createSchemaDefinitionMock } from 'smooth/graphql-node'
import { onBuild } from './smooth-node'

describe('#onBuild', () => {
  it('should generate config', async () => {
    const plugin = {
      node: true,
      plugin: { onBuild },
      options: {},
    }

    const typeDefs = gql`
      type AwesomeBook @content {
        name: String!
      }
    `

    const config = { plugins: [plugin] }

    await applyAsyncHook(config, 'onBuild', {
      schemaDefinition: createSchemaDefinitionMock({ typeDefs }),
    })
  })
})
