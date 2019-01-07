import fs from 'fs'
import { applyAsyncHook } from 'smooth-core/plugin'
import { gql, createSchemaDefinitionMock } from 'smooth-core/graphql'
import { onBuild } from '.'

jest.mock('fs')

describe('#onBuild', () => {
  beforeEach(() => {
    fs.writeFile.mockImplementation((filepath, value, cb) => {
      cb(null)
    })
  })

  it('should generate config', async () => {
    const plugin = {
      hooks: { onBuild },
      options: {
        basePath: '/tmp',
      },
    }

    const typeDefs = gql`
      type AwesomeBook @model {
        name: String!
      }
    `

    await applyAsyncHook({ plugins: [plugin] }, 'onBuild', {
      schemaDefinition: createSchemaDefinitionMock({ typeDefs }),
    })

    expect(fs.writeFile).toHaveBeenCalledTimes(1)
    expect(fs.writeFile.mock.calls[0][0]).toBe(
      '/tmp/wp-content/plugins/smooth-cms/cpt.json',
    )
    expect(JSON.parse(fs.writeFile.mock.calls[0][1])).toEqual([
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
