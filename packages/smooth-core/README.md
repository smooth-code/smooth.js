<h1 align="center">
  <img src="https://raw.githubusercontent.com/smooth-code/smooth.js/master/resources/logo-colored-light.png" alt="Smooth.js" title="Smooth.js" width="400">
</h1>
<p align="center" style="font-size: 1.2rem;">Code driven CMS powered by GraphQL & React.</p>

[![NPM version](https://img.shields.io/npm/v/smooth.svg)](https://www.npmjs.com/package/smooth)
[![CircleCI](https://circleci.com/gh/smooth-code/smooth.js.svg?style=svg)](https://circleci.com/gh/smooth-code/smooth.js)
[![Join the community on Spectrum](https://withspectrum.github.io/badge/badge.svg)](https://spectrum.chat/smooth)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [How to use](#how-to-use)
  - [Setup](#setup)
  - [Automatic code splitting](#automatic-code-splitting)
  - [CSS](#css)
    - [Built-in CSS support](#built-in-css-support)
    - [CSS-in-JS](#css-in-js)
    - [Importing CSS / Sass / Less / Stylus files](#importing-css--sass--less--stylus-files)
  - [Static file serving (e.g.: images)](#static-file-serving-eg-images)
  - [Populating `<head>`](#populating-head)
  - [Routing](#routing)
  - [Dynamic Import](#dynamic-import)
    - [1. Basic Usage (Also does SSR)](#1-basic-usage-also-does-ssr)
    - [2. With Custom Loading Component](#2-with-custom-loading-component)
  - [Custom `<App>`](#custom-app)
  - [Custom `<Document>`](#custom-document)
    - [Customizing `renderPage`](#customizing-renderpage)
  - [Custom error handling](#custom-error-handling)
  - [Custom configuration](#custom-configuration)
  - [Customizing webpack config](#customizing-webpack-config)
  - [Customizing babel config](#customizing-babel-config)
- [Production deployment](#production-deployment)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Authors](#authors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How to use

### Setup

Install it:

```bash
npm install --save smooth react react-dom
```

and add a script to your package.json like this:

```json
{
  "scripts": {
    "dev": "smooth",
    "build": "smooth build",
    "start": "smooth start"
  }
}
```

After that, the file-system is the main API. Every `.js` file becomes a route that gets automatically processed and rendered.

Populate `./pages/index$.js` inside your project:

```jsx
export default () => <div>Welcome to smooth.js!</div>
```

and then just run `npm run dev` and go to `http://localhost:3000`. To use another port, you can run `npm run dev -- -p <your port here>`.

So far, we get:

- Automatic transpilation and bundling (with webpack and babel)
- Hot code reloading
- Server rendering and indexing of `./pages`
- Static file serving. `./static/` is mapped to `/static/` (given you [create a `./static/` directory](#static-file-serving-eg-images) inside your project)

### Content

#### Link to another content

To link a content, you have to know two things: the slug and the name of the content page.

You can find the content slug in metadata and the name of the content page is just the name of the page file.

The `Link` component take care of the language for you, you can safely use it to create a link to another page.

```js
import React from 'react'
import gql from 'graphql-tag'
import { Link } from 'smooth/router'

export const contentFragment = gql`
  fragment PageProps on Page {
    books {
      metadata {
        id
        slug
      }
      name
    }
  }
`

export default function Page({ books }) {
  return (
    <ul>
      {allBooks.map(book => (
        <li key={book.metadata.id}>
          <Link to={`/books/${book.metadata.slug}`}>{book.name}</Link>
        </li>
      ))}
    </ul>
  )
}
```

### Automatic code splitting

Every `import` you declare gets bundled and served with each page. That means pages never load unnecessary code!

```jsx
import cowsay from 'cowsay-browser'

export default () => <pre>{cowsay.say({ text: 'hi there!' })}</pre>
```

### CSS

#### Built-in CSS support

Smooth.js doesn't provides a built-in CSS in JS solution. But [emotion](https://emotion.sh/) is the most easy solution, because it doesn't require any SSR configuration. You can install it and use in the project.

<details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="/examples/basic-css">Basic css</a></li>
  </ul>
</details>

<p></p>

```jsx
/** @jsx jsx */
import { jsx, css } from '@emotion/core'

export default () => (
  <div
    css={css`
      font: 15px Helvetica, Arial, sans-serif;
      background: #eee;
      padding: 100px;
      text-align: center;
      transition: 100ms ease-in background;

      &:hover {
        background: #ccc;
      }
    `}
  >
    <p>Hello World</p>
  </div>
)
```

Please see the [emotion documentation](https://emotion.sh/) for more examples.

#### CSS-in-JS

<details>
  <summary>
    <b>Examples</b>
  </summary>
  <ul>
    <li><a href="/examples/with-styled-components">Styled components</a></li>
  </ul>
</details>

<p></p>

It's possible to use any existing CSS-in-JS solution. The simplest one is inline styles:

```jsx
export default () => <p style={{ color: 'red' }}>hi there</p>
```

To use more sophisticated CSS-in-JS solutions, you typically have to implement style flushing for server-side rendering. We enable this by allowing you to define your own [custom `<Document>`](#user-content-custom-document) component that wraps each page.

#### Importing CSS / Sass / Less / Stylus files

Importing `.css`, `.scss`, `.less` or `.styl` files is not yet supported. You can probably achieve it by adding some webpack configuration but it is not recommended. CSS in JS is much more powerful with SSR rendering.

### Static file serving (e.g.: images)

Create a folder called `static` in your project root directory. From your code you can then reference those files with `/static/` URLs:

```jsx
export default () => <img src="/static/my-image.png" alt="my image" />
```

_Note: Don't name the `static` directory anything else. The name is required and is the only directory that Smooth.js uses for serving static assets._

### Populating `<head>`

<details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="/examples/head-elements">Head elements</a></li>
  </ul>
</details>

<p></p>

We expose a built-in component for appending elements to the `<head>` of the page.

```jsx
import Head from 'smooth/head'

export default () => (
  <div>
    <Head>
      <title>My page title</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <p>Hello world!</p>
  </div>
)
```

_Note: The contents of `<head>` get cleared upon unmounting the component, so make sure each page completely defines what it needs in `<head>`, without making assumptions about what other pages added_

_Note: `<title>` and `<meta>` elements need to be contained as **direct** children of the `<Head>` element, or wrapped into maximum one level of `<React.Fragment>`, otherwise the metatags won't be correctly picked up on clientside navigation._

### Routing

<details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="/examples/hello-world">Hello World</a></li>
  </ul>
</details>

<p></p>

Client-side transitions between routes can be enabled via a `<Link>` component. Consider these two pages:

```jsx
// pages/index$.js
import { Link } from 'smooth/router'

export default () => (
  <div>
    Click <Link to="/about">About</Link> to read more
  </div>
)
```

```jsx
// pages/about$.js
export default () => <p>Welcome to About!</p>
```

**Note: "smooth/router" exposes all methods from ["react-router-dom"](https://reacttraining.com/react-router/web/guides/quick-start).**

### Dynamic Import

<details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="/examples/with-dynamic-import">With Dynamic Import</a></li>
  </ul>
</details>

<p></p>

Smooth.js supports TC39 [dynamic import proposal](https://github.com/tc39/proposal-dynamic-import) for JavaScript.
With that, you could import JavaScript modules (inc. React Components) dynamically and work with them.

You can think dynamic imports as another way to split your code into manageable chunks.
Since Smooth.js supports dynamic imports with SSR, you could do amazing things with it.

Here are a few ways to use dynamic imports.

#### 1. Basic Usage (Also does SSR)

```jsx
import loadable from 'smooth/loadable'

const DynamicComponent = loadable(() => import('../components/hello'))

export default () => (
  <div>
    <Header />
    <DynamicComponent />
    <p>HOME PAGE is here!</p>
  </div>
)
```

#### 2. With Custom Loading Component

```jsx
import loadable from 'smooth/loadable'

const DynamicComponentWithCustomLoading = loadable(
  () => import('../components/hello2'),
  { fallback: <p>...</p> },
)

export default () => (
  <div>
    <Header />
    <DynamicComponentWithCustomLoading />
    <p>HOME PAGE is here!</p>
  </div>
)
```

**Note: "smooth/loadable" exposes all methods from ["@loadable/component"](https://www.smooth-code.com/open-source/loadable-components/).**

### Custom `<App>`

<details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="/examples/with-app-layout">Using `_app.js` for layout</a></li>
  </ul>
</details>

<p></p>

Smooth.js uses the `App` component to initialize pages. You can override it and control the page initialization. Which allows you to do amazing things like:

- Persisting layout between page changes
- Keeping state when navigating pages

To override, create the `./src/_app.js` file and override the App class as shown below:

```js
import React from 'react'

export default ({ Component, ...props }) => (
  <div className="layout">
    <Component {...props} />
  </div>
)
```

### Custom `<Document>`

<details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="/examples/with-styled-components">Styled components custom document</a></li>
  </ul>
</details>

<p></p>

- Is rendered on the server side
- Is used to change the initial server side rendered document markup
- Commonly used to implement server side rendering for css-in-js libraries like [styled-components](/examples/with-styled-components).

Pages in `Smooth.js` skip the definition of the surrounding document's markup. For example, you never include `<html>`, `<body>`, etc. To override that default behavior, you must create a file at `./src/_document.js`, where you can extend the `Document` class:

```jsx
// _document is only rendered on the server side and not on the client side
// Event handlers like onClick can't be added to this file

// ./src/_document.js
import Document, { Head, Main, MainScript } from 'smooth/document'

export default () => (
  <html>
    <Head>
      <style>{`body { margin: 0 } /* custom! */`}</style>
    </Head>
    <body className="custom_class">
      <Main />
      <MainScript />
    </body>
  </html>
)
```

All of `<Head />`, `<Main />` and `<MainScript />` are required for page to be properly rendered.

**Note: React-components outside of `<Main />` will not be initialised by the browser. Do _not_ add application logic here. If you need shared components in all your pages (like a menu or a toolbar), take a look at the `App` component instead.**

#### Customizing `renderPage`

🚧 It should be noted that the only reason you should be customizing `renderPage` is for usage with css-in-js libraries
that need to wrap the application to properly work with server-rendering. 🚧

- It takes as argument an options object for further customization

```js
import Document from 'smooth/document'

Document.getInitialProps = ctx => {
  const sheet = new ServerStyleSheet()

  const originalRenderPage = ctx.renderPage
  ctx.renderPage = () =>
    originalRenderPage({
      // wrap the all react tree
      enhanceApp: App => App,
    })

  // Return additional props
  return {}
}

export default Document
```

### Custom error handling

404 or 500 errors are handled both client and server side by a default component `error.js`. If you wish to override it, define a `_error.js` in the src folder:

⚠️ The default `error.js` component is only used in production ⚠️

```jsx
import React from 'react'

export default ({ error }) => (
  <p>
    {error.statusCode
      ? `An error ${error.statusCode} occurred on server`
      : 'An error occurred on client'}
  </p>
)
```

### Custom configuration

For custom advanced behavior of Smooth.js, you can create a `smooth.config.js` in the root of your project directory (next to `src/` and `package.json`).

Note: `smooth.config.js` is a regular Node.js module, not a JSON file. It gets used by the Smooth server and build phases, and not included in the browser build.

```js
// smooth.config.js
module.exports = {
  /* config options here */
}
```

### Customizing webpack config

<details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="/examples/with-webpack-bundle-analyzer">Custom webpack bundle analyzer</a></li>
  </ul>
</details>

<p></p>

In order to extend our usage of `webpack`, you can define a function that extends its config via `smooth.config.js`.

```js
// smooth.config.js is not transformed by Babel. So you can only use javascript features supported by your version of Node.js.

module.exports = {
  webpack: (config, { dev, isServer, defaultLoaders }) => {
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  webpackDevMiddleware: config => {
    // Perform customizations to webpack dev middleware config
    // Important: return the modified config
    return config
  },
}
```

The second argument to `webpack` is an object containing properties useful when customizing its configuration:

- `dev` - `Boolean` shows if the compilation is done in development mode
- `isServer` - `Boolean` shows if the resulting configuration will be used for server side (`true`), or client size compilation (`false`).
- `defaultLoaders` - `Object` Holds loader objects Smooth.js uses internally, so that you can use them in custom configuration
  - `babel` - `Object` the `babel-loader` configuration for Smooth.js.

Example usage of `defaultLoaders.babel`:

```js
// Example smooth.config.js for adding a loader that depends on babel-loader
module.exports = {
  webpack: (config, {}) => {
    config.module.rules.push({
      test: /\.mdx/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: pluginOptions.options,
        },
      ],
    })

    return config
  },
}
```

### Customizing babel config

<details>
  <summary><b>Examples</b></summary>
  <ul>
    <li><a href="/examples/with-custom-babel-config">Custom babel configuration</a></li>
  </ul>
</details>

<p></p>

In order to extend our usage of `babel`, you can simply define a `.babelrc` file at the root of your app. This file is optional.

If found, we're going to consider it the _source of truth_, therefore it needs to define what smooth needs as well, which is the `smooth/babel` preset.

This is designed so that you are not surprised by modifications we could make to the babel configurations.

Here's an example `.babelrc` file:

```json
{
  "presets": ["smooth/babel"],
  "plugins": []
}
```

The `smooth/babel` preset includes everything needed to transpile React applications. This includes:

- preset-env
- preset-react
- plugin-proposal-class-properties
- @loadable/babel-plugin

These presets / plugins **should not** be added to your custom `.babelrc`. Instead, you can configure them on the `smooth/babel` preset:

```json
{
  "presets": [
    [
      "smooth/babel",
      {
        "preset-env": {},
        "transform-runtime": {}
      }
    ]
  ],
  "plugins": []
}
```

The `modules` option on `"preset-env"` should be kept to `false` otherwise webpack code splitting is disabled.

## Production deployment

To deploy, instead of running `smooth`, you want to build for production usage ahead of time. Therefore, building and starting are separate commands:

```bash
smooth build
smooth start
```

For example, to deploy with [`now`](https://zeit.co/now) a `package.json` like follows is recommended:

```json
{
  "name": "my-app",
  "dependencies": {
    "smooth": "latest"
  },
  "scripts": {
    "dev": "smooth dev",
    "build": "smooth build",
    "start": "smooth start"
  }
}
```

Then run `now` and enjoy!

## Browser support

Smooth.js supports IE11 and all modern browsers out of the box using [`@babel/preset-env`](https://new.babeljs.io/docs/en/next/babel-preset-env.html).

## Contributing

Please see our [contributing.md](/contributing.md)

## Authors

- Greg Bergé ([@neoziro](https://twitter.com/neoziro)) – [Smooth Code](https://www.smooth-code.com)
