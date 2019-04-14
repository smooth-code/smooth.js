# smooth-plugin-head-meta

Automatically adds metadata in contents.

## Install

`npm install smooth-plugin-head-meta smooth-plugin-react-helmet react-helmet`

## Usage

Edit `smooth.config.js`:

```js
// smooth.config.js
module.exports = {
  plugins: ['smooth-plugin-react-helmet', 'smooth-plugin-head-meta'],
}
```

### Whitelist

By default, all contents have metadata, you can specify a whitelist to enable it only on custom contents.

```js
// smooth.config.js
module.exports = {
  plugins: [
    'smooth-plugin-react-helmet',
    {
      resolve: 'smooth-plugin-head-meta',
      // Metadata will only be visible on "Page" and "Movie" content.
      options: { whitelist: ['Page', 'Movie'] },
    },
  ],
}
```
