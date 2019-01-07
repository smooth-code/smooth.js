import chokidar from 'chokidar'
import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'

let numCopied = 0

const quit = () => {
  // eslint-disable-next-line no-console
  console.log(`Copied ${numCopied} files`)
  process.exit()
}

const copyPath = (oldPath, newPath, quiet) =>
  new Promise((resolve, reject) => {
    fs.copy(oldPath, newPath, err => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        return reject(err)
      }

      numCopied += 1
      if (!quiet) {
        // eslint-disable-next-line no-console
        console.log(`Copied ${oldPath} to ${newPath}`)
      }
      return resolve()
    })
  })

/*
 * non-existant packages break on('ready')
 * See: https://github.com/paulmillr/chokidar/issues/449
 */
function watch(root, packages, { scanOnce, quiet }) {
  const ignored = [/[/\\]node_modules[/\\]/i, /\.git/i, /\.DS_Store/].concat(
    packages.map(p => new RegExp(`${p}[\\/\\\\]src[\\/\\\\]`, `i`)),
  )
  const watchers = _.uniq(
    packages
      .map(p => path.join(root, `/packages/`, p))
      .filter(p => fs.existsSync(p)),
  )

  let allCopies = []

  chokidar
    .watch(watchers, {
      ignored: [filePath => _.some(ignored, reg => reg.test(filePath))],
    })
    .on(`all`, (event, filePath) => {
      const watchEvents = [`change`, `add`]
      if (_.includes(watchEvents, event)) {
        const [packageName] = filePath
          .split(/packages[/\\]/)
          .pop()
          .split(/[/\\]/)
        const prefix = path.join(root, `/packages/`, packageName)

        // Copy it over local version.
        // Don't copy over the Smooth bin file as that breaks the NPM symlink.
        if (_.includes(filePath, `smooth-dev-cli/lib/cli/index.js`)) {
          return
        }

        const newPath = path.join(
          `./node_modules/${packageName}`,
          path.relative(prefix, filePath),
        )

        const localCopies = [copyPath(filePath, newPath, quiet)]

        allCopies = allCopies.concat(localCopies)
      }
    })
    .on(`ready`, () =>
      // all files watched, quit once all files are copied if necessary
      Promise.all(allCopies).then(() => {
        if (scanOnce) {
          quit()
        }
      }),
    )
}

module.exports = watch
