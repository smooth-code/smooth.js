import camelcase from 'camelcase'

export default function getMocks({ createSeeds, output = {} }) {
  createSeeds({
    actions: {
      createContents({ type: rawType, onCreateContents, onCreateMock }) {
        const type = camelcase(rawType)
        output[type] = output[type] || {}
        onCreateContents({
          actions: {
            createContent({ name, data }) {
              function createMock(data) {
                output[type][name] = data
              }
              if (onCreateMock) {
                onCreateMock({ actions: { createMock }, data, name })
              } else {
                createMock(data)
              }
            },
          },
          output,
        })
      },
      createContentsFromFolder({ webpack }) {
        const type = 'pages'
        output[type] = output[type] || {}
        const context = webpack()

        context.keys().forEach(file => {
          getMocks({ createSeeds: context(file).default, output })
        })
      },
      createMediaFromFolder({ onCreateMock, webpack }) {
        const type = 'media'
        output[type] = output[type] || {}
        const context = webpack()
        context.keys().forEach(file => {
          const name = file.replace(/^.*?([^/]+?)(\.[^.]+)?$/, '$1')
          const data = { url: file.replace(/^\./, '') }
          function createMock(data) {
            output[type][name] = data
          }
          if (onCreateMock) {
            onCreateMock({ actions: { createMock }, data, name })
          } else {
            createMock(data)
          }
        })
      },
    },
  })

  return output
}
