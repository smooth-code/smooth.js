# smooth-plugin-react-helmet

Provides drop-in support for server rendering data added with
[React Helmet](https://github.com/nfl/react-helmet).

React Helmet is a component which lets you control your document head using
their React component.

With this plugin, attributes you add in their component, e.g. title, meta
attributes, etc. will get added to the static HTML pages Gatsby builds.

This is important not just for site viewers, but also for SEO -- title and description metadata stored in the document head is a key component used by Google in determining placement in search results.

## Install

`npm install smooth-plugin-react-helmet react-helmet`

## Usage

Edit `smooth.config.js`:

```js
// smooth.config.js
module.exports = {
  plugins: ['smooth-plugin-react-helmet'],
}
```
