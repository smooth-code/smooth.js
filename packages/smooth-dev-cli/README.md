# gatsby-dev-cli

A command-line tool for local Smooth development. When doing development work on
Smooth core, this tool allows you to copy the changes to the various
Smooth packages to Smooth sites that you're testing your changes on.

## Install

`npm install -g smooth-dev-cli`

## Configuration / First time setup

The smooth-dev-cli tool needs to know where your cloned Smooth repository is
located. You typically only need to configure this once.

`smooth-dev --set-path-to-repo /path/to/my/cloned/version/smooth`

## How to use

Navigate to the project you want to link to your forked Smooth repository and
run:

`smooth-dev`

The tool will then scan your project's package.json to find its Gatsby
dependencies and copy the latest source from your cloned version of Gatsby into
your project's node_modules folder. A watch task is then created to re-copy any
modules that might change while you're working on the code, so you can leave
this program running.

Typically you'll also want to run `npm run watch` in the Gatsby repo to set up
watchers to build Gatsby source code.

**[Demo Video](https://www.youtube.com/watch?v=D0SwX1MSuas)**

More detailed instruction for setting up your Gatsby development environment can
be found [here](https://www.gatsbyjs.org/docs/how-to-contribute/).

### Other commands

#### `--packages`

You can prevent the automatic dependencies scan and instead specify a list of
packages you want to link by using the `--packages` option:

`smooth-dev --packages smooth smooth-backend-wordpress`

#### `--quiet`

Don't output anything except for a quit message when used together with
`--scan-once`.

#### `--copy-all`

Copy all modules/files in the smooth source repo in packages/
