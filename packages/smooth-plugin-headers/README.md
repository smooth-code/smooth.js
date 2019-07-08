# smooth-plugin-headers

Automatically adds response headers.

## Usage

Edit `smooth.config.js`:

```js
// smooth.config.js
module.exports = {
  plugins: [
    {
      resolve: 'smooth-plugin-headers',
      options: {
        // Add any options here
      },
    }
  ],
}
```

## Options

### headers

Set headers for all maching pages, ReactRouter format can be used (see [path-to-regexp](https://www.npmjs.com/package/path-to-regexp)).  
Headers entries are merged on differents rules but are overwritten on sames, below rules overwrite above ones.

```js
// smooth.config.js
module.exports = {
  plugins: [
    {
      resolve: 'smooth-plugin-headers',
      options: {
        headers: {
          '(.*)': ['Cache-Control: public, max-age=900'],
          '(*.ico)': ['Cache-Control: public, max-age=2592000'],
          '/graphql': ['Cache-Control: no-cache'],
        },
      },
    }
  ],
}
```
