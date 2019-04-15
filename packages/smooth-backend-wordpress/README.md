# smooth-backend-wordpress

Wordpress backend for Smooth.js.

## Install

`npm install smooth-backend-wordpress`

## Usage

Edit `smooth.config.js`:

```js
// smooth.config.js
module.exports = {
  plugins: [
    {
      resolve: 'smooth-backend-wordpress',
      options: {
        // Add any options here
      },
    },
  ],
}
```

### Options

#### basePath

Wordpress directory.

#### baseUrl

Remote URL of the Wordpress.

#### homeUrl

URL of your website.
