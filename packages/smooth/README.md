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
  - [Structure](#structure)
    - [Directives](#directives)
      - [`@content`](#content)
      - [`@field`](#field)
      - [`@block`](#block)
    - [Additional GraphQL types](#additional-graphql-types)
      - [Date](#date)
      - [DateTime](#datetime)
      - [Image](#image)
      - [Media](#media)
      - [Link](#link)
      - [Metadata](#metadata)
      - [Block](#block)
    - [Schemas](#schemas)
    - [Content API](#content-api)
      - [Filters](#filters)
  - [Pages](#pages)
    - [Content Pages](#content-pages)
    - [Fixed slug pages](#fixed-slug-pages)
  - [Query](#query)
  - [Content](#content)
    - [Link to another content](#link-to-another-content)
  - [Automatic code splitting](#automatic-code-splitting)
  - [CSS](#css)
    - [Built-in CSS support](#built-in-css-support)
    - [CSS-in-JS](#css-in-js)
    - [Importing CSS / Sass / Less / Stylus files](#importing-css--sass--less--stylus-files)
  - [Static file serving (e.g.: images)](#static-file-serving-eg-images)
  - [Routing](#routing)
  - [Dynamic Import](#dynamic-import)
    - [1. Basic Usage (Also does SSR)](#1-basic-usage-also-does-ssr)
    - [2. With Custom Loading Component](#2-with-custom-loading-component)
  - [Custom `<App>`](#custom-app)
  - [Custom error handling](#custom-error-handling)
  - [Custom configuration](#custom-configuration)
  - [Customizing webpack config](#customizing-webpack-config)
  - [Customizing babel config](#customizing-babel-config)
- [Plugins Hooks](#plugins-hooks)
  - [Plugins API](#plugins-api)
  - [smooth-node.js](#smooth-nodejs)
  - [smooth-browser.js](#smooth-browserjs)
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
    "dev": "smooth dev",
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

### Structure

#### Directives

##### `@content`

Can be used on a GraphQL type definition. Indicates that this type will be available in backoffice.

```graphql
# A "Book" content will be available in backoffice
type Book @content {
  title: String @field
}

# This type will not be available in backoffice
type User {
  name: String
}
```

**Specify icon**

Some backoffices like Wordpress supports an icon. `@content` supports it as a parameter:

```graphql
type Book @content(icon: "dashicons-format-gallery") {
  title: String @field
}
```

**Specify slug**

Slug is automatically generated from the name but you can also specify a specific one. Slug has an impact in the API and in the backoffice. It is the internal name of the content.

```graphql
type Book @content(slug: "awesome-book") {
  title: String @field
}
```

**Specify label**

Label is automatically generated from the name but you can also specify a specific one. Label has an impact in the backoffice. It is the name used to display the name of the content.

```graphql
type Book @content(label: "Awesome Book") {
  title: String @field
}
```

**Specify a description**

GraphQL comments are automatically converted in description in the backoffice.

```graphql
"It is just a book, relax."
type Book @content {
  title: String @field
}
```

##### `@field`

Can be used on a GraphQL field definition. Indicates that this field will be available in the backoffice. `@field` must only be used in a type marked as `@content`.

```graphql
type Book @content {
  # This field is editable in backoffice
  title: String @field
  # This field is not editable in backoffice
  # you have to write a custom resolver for it
  likes: Int
}
```

**Specify type explicitely**

Most of field types are inferred from the GraphQL type of the field. A `String` will generate a text input, a `Boolean` will display a checkbox, etc... Sometimes you have to precise the exact type of field. For an example, a `String` display a `shortText`, but you could also want a `richText`.

For this specific use-case you can specify a `type` argument in the `@field` directive:

```graphql
type Book @content {
  # Will display a "shortText" in backoffice
  title: String @field
  # Will display a "longText" in backoffice
  description: String @field(type: longText)
}
```

Available types are: `shortText`, `longText` and `richText`, all other types are inferred from the GraphQL types, including special ones like `Image`, `Link` and `Media`.

**Specify a label**

Exactly like for `@content` you may want to display a custom label for this field. The label is used only in the backoffice.

```graphql
type Book @content {
  title: String @field(label: "My awesome title")
}
```

**Specify a description**

GraphQL comments are automatically converted in description in the backoffice.

```graphql
type Book @content {
  "The title of the book, yeah the big title!"
  title: String @field
}
```

##### `@block`

Can be used on a GraphQL type definition. Indicates that this type will be available in the special `Block` type.

```graphql
type Page @content {
  # The special type "Block" indicates that all blocks will be available in backoffice
  blocks: [Block] @field
}

# This type will be available as a block in the "Page" content
type Hero @block {
  text: String @field
}
```

#### Additional GraphQL types

##### Date

[RFC 3339](https://github.com/excitement-engineer/graphql-iso-date/blob/HEAD/rfc3339.txt) compliant date. See [graphql-iso-date](https://github.com/excitement-engineer/graphql-iso-date) for more information.

##### DateTime

[RFC 3339](https://github.com/excitement-engineer/graphql-iso-date/blob/HEAD/rfc3339.txt) compliant date time. See [graphql-iso-date](https://github.com/excitement-engineer/graphql-iso-date) for more information.

##### Image

Represents an image, with several pre-configured sizes.

```graphql
type ImageSize {
  width: Int!
  height: Int!
  url: String!
}

type Image {
  id: ID!
  url: String!
  mimeType: String!
  alt: String
  title: String
  thumbnail: ImageSize!
  medium: ImageSize!
  large: ImageSize!
}
```

##### Media

Represents a media, just a file.

```graphql
type Media {
  title: String
  url: String!
}
```

##### Link

Represents a link to another page or content.

```graphql
type Link {
  title: String
  url: String!
  target: String!
}
```

##### Metadata

Additional metadata accessible on contents.

```graphql
type Metadata {
  id: ID!
  slug: String!
}
```

##### Block

Special type to indicates all defined blocks.

#### Schemas

All your GraphQL schemas must be placed in `src/schemas`, you can place them in separated files or in a single files. The only requirement is to place them in `src/schemas`.

You must specify your type definition in a named export `typeDefs`:

```js
import gql from 'graphql-tag'

export const typeDefs = gql`
  type Actor {
    name: String! @field
  }

  type Movie @content {
    title: String! @field
    description: String! @field(type: richText)
    cover: Image! @field
    actors: [Actor!]! @field
  }
`
```

And you can specify resolvers in a named export `resolvers`:

```js
import gql from 'graphql-tag'

export const typeDefs = gql`
  type Movie @content {
    title: String! @field
    likes: Int
  }
`

export const resolvers = {
  Movie: {
    async likes(object, params, { slug }) {
      // This is an example of an external call to get movie likes
      return api.getMovieLikes(slug)
    },
  },
}
```

> `resolvers` are only required for field definition not marked as `@field`.

#### Content API

Sometimes, you may want to be able to request a set of contents. For example, a block that display three movies automatically.

```js
import gql from 'graphql-tag'

export const typeDefs = gql`
  type MovieListBlock @block {
    # This type is not displayed in backoffice
    movies: [Movie!]!
  }
`
export const resolvers = {
  MovieListBlock: {
    // This resolvers automatically display a list of movies
    async movies(object, params, { api }) {
      // The "type" is the slug of your content
      return api.getContents({ type: 'movie' })
    },
  },
}
```

##### Filters

Available filters depends of your backoffice, using `Wordpress` we rely on [wp-rest-filter](https://wordpress.org/plugins/wp-rest-filter/). To use it, add a `query` to `api.getContents`:

```js
// Get last 30 news ordered by "publicationDate"
api.getContents({
  type: 'news',
  query: {
    per_page: 30,
    meta_key: 'publicationDate',
    orderby: 'meta_value',
    order: 'desc',
  },
})

// Get the last 4 projects:
// - ordered by "date"
// - with "hasPage" flag marked as true
// - and exclude the current object
api.getContents({
  type: 'projects',
  query: {
    per_page: 4,
    orderby: 'date',
    order: 'desc',
    filter: {
      meta_query: [{ key: 'hasPage', value: 1 }],
    },
    exclude: [object.id],
  },
})
```

### Pages

All your pages must be placed in `src/pages`. The name of the page determines the route of the page. Pages offers several possibilities, display a content or create a page from scratch.

All pages must have a default export that represents the component used to display the page.

```js
// src/pages/hello.js
export default function Hello() {
  return 'Hello world!'
}
```

When I access to `/hello`, I see "Hello world!".

#### Content Pages

A content page is a page with a named export `contentFragment` that contains a fragment on a GraphQL type marked as `@content`. And of course a component as the default export. All fields specified in fragments are available as props.

```js
import React from 'react'
import gql from 'graphql-tag'

// The name of the fragment "MovieProps" does not matter
// but it is recommended to named it like that.
export const contentFragment = gql`
  fragment MovieProps on Movie {
    title
    description
    cover {
      url
      alt
    }
  }
`

export default function Movie({ title, description, cover }) {
  return (
    <div>
      <img src={cover.url} alt={cover.alt} />
      <div>{title}</div>
      <p>{description</p>
    </div>
  )
}
```

#### Fixed slug pages

All pages are "wildcard" pages by default. It means that the page matches for all urls. For example, if I create a page `books.js`. The page will matches for URL "/books/foo/bar". In fact if this page has a content, it will look for a content with the slug "foo/bar". Most of time this is the correct behaviour, but sometimes you may want to be able to control it and to create a dedicated page.

To create a dedicated page, not wildcard, you have to add a `$` at the end of the name. Let's take the same page `books$.js`. The page will matches only URL "/books/foo/bar" but it will only look for the content with the slug "books".

**Customize slug**

To change the slug looked for by a fixed slug page, you can use `contentSlug` variable. For example, a page named `best-book$.js` will look for `best-book` by default. But you can customize it.

```js
// The page is still accessible under "/best-book", but it will look for "harry-potter" book
export const contentSlug = 'harry-potter'
```

You can also specify a function to compute slug from the url.

```js
export const contentSlug = ({ location }) => location.pathname
```

### Query

You can write your GraphQL queries using the `Query` component. For example, in `_app.js` you can choose to display the settings.

```js
// src/_app.js
import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'smooth/query'

const PAGE = gql`
  query Settings {
    settings(slug: "main") {
      title
    }
  }
`

export default function Page({ Component, ...props }) {
  return (
    <Query query={PAGE}>
      {({ data }) =>
        data && (
          <>
            <h1>{data.settings.title}</h1>
            <Component {...props} />
          </>
        )
      }
    </Query>
  )
}
```

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
    <li><a href="/examples/with-emotion">Emotion</a></li>
  </ul>
</details>

<p></p>

It's possible to use any existing CSS-in-JS solution. The simplest one is inline styles:

```jsx
export default () => <p style={{ color: 'red' }}>hi there</p>
```

#### Importing CSS / Sass / Less / Stylus files

Importing `.css`, `.scss`, `.less` or `.styl` files is not yet supported. You can probably achieve it by adding some webpack configuration but it is not recommended. CSS in JS is much more powerful with SSR rendering.

### Static file serving (e.g.: images)

Create a folder called `static` in your project root directory. From your code you can then reference those files with `/static/` URLs:

```jsx
export default () => <img src="/static/my-image.png" alt="my image" />
```

_Note: Don't name the `static` directory anything else. The name is required and is the only directory that Smooth.js uses for serving static assets._

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

## Plugins Hooks

### Plugins API

- resolveOptions

### smooth-node.js

- onCreateServer
- onCreateApolloServerConfig
- onRenderBody
- onServerError
- onCreateBabelConfig
- onCreateWebpackConfig
- getContents
- getContent
- onBuild
- wrapRootElement

### smooth-browser.js

- onRouteUpdate
- onSelectContentFields
- wrapContentElement

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
