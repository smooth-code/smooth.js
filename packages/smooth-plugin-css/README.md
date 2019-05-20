# smooth-plugin-css

A [Smooth](https://github.com/smooth-code/smooth.js) plugin for CSS with
built-in server-side rendering support.

## Install

`npm install smooth-plugin-css`

## Usage

Edit `smooth.config.js`:

```js
// smooth.config.js
module.exports = {
  plugins: [
    {
      resolve: `smooth-plugin-css`,
      options: {
        // Add any options here
      },
    },
  ],
}
```
