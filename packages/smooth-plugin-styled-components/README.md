# smooth-plugin-styled-components

A [Smooth](https://github.com/smooth-code/smooth.js) plugin for
[styled-components](https://github.com/styled-components/styled-components) with
built-in server-side rendering support.

## Install

`npm install smooth-plugin-styled-components styled-components babel-plugin-styled-components`

## Usage

Edit `smooth.config.js`:

```js
// smooth.config.js
module.exports = {
  plugins: [
    {
      resolve: `smooth-plugin-styled-components`,
      options: {
        // Add any options here
      },
    },
  ],
}
```

### Options

You can pass options to the plugin, see the [Styled Components docs](https://www.styled-components.com/docs/tooling#babel-plugin) for a full list of options.

For example, to disable the `displayName` option:

```js
// smooth.config.js
module.exports = {
  plugins: [
    {
      resolve: `smooth-plugin-styled-components`,
      options: {
        displayName: false,
      },
    },
  ],
}
```

> Note: The `ssr` option will be ignored. Smooth.js will apply it automatically when needed.
