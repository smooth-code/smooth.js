#!/usr/bin/env node

import Configstore from 'configstore'
import _ from 'lodash'
import os from 'os'
import path from 'path'
import yargs from 'yargs'
import watch from './watch'
import pkg from '../package.json'

const { argv } = yargs
  .usage(`Usage: smooth-dev [options]`)
  .alias(`q`, `quiet`)
  .nargs(`q`, 0)
  .describe(`q`, `Do not output copy file information`)
  .alias(`s`, `scan-once`)
  .nargs(`s`, 0)
  .describe(`s`, `Scan once. Do not start file watch`)
  .alias(`p`, `set-path-to-repo`)
  .nargs(`p`, 0)
  .describe(
    `p`,
    `Set path to Smooth repository.
You typically only need to configure this once.`,
  )
  .alias(`C`, `copy-all`)
  .nargs(`C`, 0)
  .describe(
    `C`,
    `Copy all contents in packages/ instead of just smooth packages`,
  )
  .array(`packages`)
  .describe(`packages`, `Explicitly specify packages to copy`)
  .help(`h`)
  .alias(`h`, `help`)

const conf = new Configstore(pkg.name)

const fs = require(`fs-extra`)
const havePackageJsonFile = fs.existsSync(`package.json`)

if (!havePackageJsonFile) {
  // eslint-disable-next-line no-console
  console.error(`Current folder must have a package.json file!`)
  process.exit()
}

let pathToRepo = argv.setPathToRepo

if (pathToRepo) {
  if (pathToRepo.includes(`~`)) {
    pathToRepo = path.join(os.homedir(), pathToRepo.split(`~`).pop())
  }
  conf.set(`smooth-location`, path.resolve(pathToRepo))
  process.exit()
}

const smoothLocation = conf.get(`smooth-location`)

if (!smoothLocation) {
  // eslint-disable-next-line no-console
  console.error(
    `
You haven't set the path yet to your cloned
version of Smooth. Do so now by running:

smooth-dev --set-path-to-repo /path/to/my/cloned/version/smooth
`,
  )
  process.exit()
}

const localPkg = JSON.parse(fs.readFileSync(`package.json`))
let packages = Object.keys(
  _.merge({}, localPkg.dependencies, localPkg.devDependencies),
)

if (argv.copyAll) {
  packages = fs.readdirSync(path.join(smoothLocation, `packages`))
} else {
  const { dependencies } = JSON.parse(
    fs.readFileSync(
      path.join(smoothLocation, `packages/smooth/package.json`),
    ),
  )
  packages = packages
    .concat(Object.keys(dependencies))
    .filter(p => p.startsWith(`smooth`))
}

if (!argv.packages && _.isEmpty(packages)) {
  // eslint-disable-next-line no-console
  console.error(
    `
You haven't got any Smooth dependencies into your current package.json

You probably want to pass in a list of packages to start
developing on! For example:

smooth-dev --packages smooth smooth-backend-wordpress

If you prefer to place them in your package.json dependencies instead,
smooth-dev will pick them up.
`,
  )
  process.exit()
}

watch(smoothLocation, argv.packages || packages, {
  quiet: argv.quiet,
  scanOnce: argv.scanOnce,
})
