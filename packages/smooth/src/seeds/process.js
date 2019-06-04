import glob from 'tiny-glob'
import camelcase from 'camelcase'
import babelRequire from '../babel/require'
import { createBackendPayload } from '../plugin/nodeHooks'

async function collectCommands({
  createSeeds,
  onCreateBackendPayload: onCreateBackendPayloadDefault,
}) {
  const commands = []

  function createContents({
    onCreateBackendPayload = onCreateBackendPayloadDefault,
    onCreateContents,
    type,
  }) {
    commands.push({
      label: 'createContents',
      onCreateBackendPayload,
      onCreateContents,
      type,
    })
  }

  function createContentsFromFolder({
    node,
    webpack,
    onCreateBackendPayload = onCreateBackendPayloadDefault,
  }) {
    commands.push({
      label: 'createContentsFromFolder',
      node,
      onCreateBackendPayload,
      webpack,
    })
  }

  function createMediaFromFolder({
    node,
    onCreateBackendPayload = onCreateBackendPayloadDefault,
    webpack,
  }) {
    commands.push({
      label: 'createMediaFromFolder',
      node,
      onCreateBackendPayload,
      type: 'media',
      webpack,
    })
  }

  createSeeds({
    actions: {
      createContents,
      createContentsFromFolder,
      createMediaFromFolder,
    },
  })

  // eslint-disable-next-line no-use-before-define
  return resolveContentsFromFolder({ commands })
}

async function resolveContentsFromFolder({ commands = [] }) {
  if (!commands.length) {
    return commands
  }

  const [command, ...otherCommands] = commands
  if (command.label !== 'createContentsFromFolder') {
    return [
      command,
      ...(await resolveContentsFromFolder({ commands: otherCommands })),
    ]
  }

  const files = await command.node({
    glob: ({ cwd, path }) => glob(path, { cwd, absolute: true }),
  })

  const commandsFromFolder = []
  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    commandsFromFolder.push(
      // eslint-disable-next-line no-await-in-loop
      ...(await collectCommands({
        createSeeds: babelRequire(file).default,
        onCreateBackendPayload: command.onCreateBackendPayload,
      })),
    )
  }

  return [
    ...commandsFromFolder,
    ...(await resolveContentsFromFolder({ commands: otherCommands })),
  ]
}

export default async function process({ api, config, createSeeds, logger }) {
  const commands = await collectCommands({ createSeeds })
  const output = {}
  const createBackendPayloadHook = createBackendPayload(config)

  /* eslint-disable no-await-in-loop, no-loop-func */
  // eslint-disable-next-line no-restricted-syntax
  for (const command of commands) {
    await logger(
      (async () => {
        const type = camelcase(command.type)
        const payload = []

        function createContent({ name, data }) {
          if (command.onCreateBackendPayload) {
            command.onCreateBackendPayload({
              actions: {
                createBackendPayload(data) {
                  payload.push({ data, name })
                },
              },
              data: createBackendPayloadHook({
                data,
                name,
                type: command.type,
              }),
              name,
            })
          } else {
            payload.push({
              data: createBackendPayloadHook({
                data,
                name,
                type: command.type,
              }),
              name,
            })
          }
        }

        switch (command.label) {
          case 'createContents': {
            command.onCreateContents({
              actions: { createContent },
              output,
            })
            break
          }

          case 'createMediaFromFolder': {
            const files = await command.node({
              glob: ({ cwd, path }) => glob(path, { cwd, absolute: true }),
            })
            files.forEach(data => {
              const name = data.replace(/^.*?([^/]+?)(\.[^.]+)?$/, '$1')
              createContent({ name, data })
            })
            break
          }

          default: {
            throw new Error(`Unexpected command ${command.label}`)
          }
        }

        if (!output[type]) {
          output[type] = {}
          await api.truncate({ type: command.type })
        }

        await api
          .createMany({
            type: command.type,
            data: payload.map(({ data }) => data),
          })
          .then(response => {
            response.forEach((data, i) => {
              output[type][payload[i].name] = data.id
            })
          })
      })(),
      `Generate ${command.type}`,
    )
  }
  /* eslint-enable no-await-in-loop, no-loop-func */

  return output
}
