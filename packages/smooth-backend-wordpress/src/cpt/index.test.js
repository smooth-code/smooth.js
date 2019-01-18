import { applyAsyncHook } from 'smooth-core/plugin'
import { gql, createSchemaDefinitionMock } from 'smooth-core/graphql'
import { getPluginDir, writeFile } from '../util'
import { onBuild } from '.'

jest.mock('../util')

describe('#onBuild', () => {
  beforeEach(() => {
    getPluginDir.mockImplementation(async () => '/plugins')
  })

  it('should generate config', async () => {
    const plugin = {
      hooks: { onBuild },
      options: {
        basePath: '/tmp',
      },
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

    expect(writeFile).toHaveBeenCalledTimes(1)
    expect(writeFile.mock.calls[0][0]).toBe('/plugins/cpt.json')
    expect(JSON.parse(writeFile.mock.calls[0][1])).toEqual([
      {
        config: {
          label: 'Awesome books',
          menu_icon: null,
          public: true,
          show_in_rest: true,
        },
        name: 'awesomebook',
      },
    ])
  })
})
