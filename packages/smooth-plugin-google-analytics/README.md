# smooth-plugin-google-analytics

Easily add Google Analytics to your Smooth site.

## Install

`npm install smooth-plugin-google-analytics`

## Usage

Edit `smooth.config.js`:

```js
// smooth.config.js
module.exports = {
  plugins: [
    {
      resolve: 'smooth-plugin-google-analytics',
      options: {
        trackingId: 'YOUR_GOOGLE_ANALYTICS_TRACKING_ID',
        // Puts tracking script in the head instead of the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Avoids sending pageview hits from custom paths
        exclude: ['/preview/**', '/do-not-track/me/too/'],
        // Enables Google Optimize using your container Id
        optimizeId: 'YOUR_GOOGLE_OPTIMIZE_TRACKING_ID',
        // Enables Google Optimize Experiment ID
        experimentId: 'YOUR_GOOGLE_EXPERIMENT_ID',
        // Set Variation ID. 0 for original 1,2,3....
        variationId: 'YOUR_GOOGLE_OPTIMIZE_VARIATION_ID',
        // Any additional create only fields (optional)
        sampleRate: 5,
        siteSpeedSampleRate: 10,
        cookieDomain: 'example.com',
      },
    },
  ],
}
```

See below for the complete list of [Create Only Fields](#create-only-fields).

### `<OutboundLink>`

To make it easy to track clicks on outbound links in Google Analytics,
the plugin provides a component.

To use it, simply import it and use it like you would the `<a>` element e.g.

```jsx
import React from 'react'
import { OutboundLink } from 'smooth-plugin-google-analytics'

export default function Main() {
  return (
    <div>
      <OutboundLink eventLabel="Google" href="https://www.google.com">
        Visit Google
      </OutboundLink>
    </div>
  )
}
```

### Options

#### "anonymize"

Some countries (such as Germany) require you to use the
[\_anonymizeIP](https://support.google.com/analytics/answer/2763052) function for
Google Analytics. Otherwise you are not allowed to use it. The option adds two
blocks to the code:

```js
function gaOptout(){document.cookie=disableStr+'=true; expires=Thu, 31 Dec 2099 23:59:59 UTC;path=/',window[disableStr]=!0}var gaProperty='UA-XXXXXXXX-X',disableStr='ga-disable-'+gaProperty;document.cookie.indexOf(disableStr+'=true')>-1&&(window[disableStr]=!0);

...

ga('set', 'anonymizeIp', 1);
```

If your visitors should be able to set an Opt-Out-Cookie (No future tracking)
you can set a link e.g. in your imprint as follows:

`<a href="javascript:gaOptout();">Deactivate Google Analytics</a>`

#### "respectDNT"

If you enable this optional option, Google Analytics will not be loaded at all for visitors that have "Do Not Track" enabled. While using Google Analytics does not necessarily constitute Tracking, you might still want to do this to cater to more privacy oriented users.

#### "exclude"

If you need to exclude any path from the tracking system, you can add it (one or more) to this optional array as glob expressions.

#### "optimizeId"

If you need to use Google Optimize for A/B testing, you can add this optional Optimize container id to allow Google Optimize to load the correct test parameters for your site.

#### "experimentId"

If you need to set up SERVER_SIDE Google Optimize experiment, you can add the experiment ID. The experiment ID is shown on the right-hand panel on the experiment details page. [Server-side Experiments](https://developers.google.com/optimize/devguides/experiments)

#### "variationId"

Besides the experiment ID you also need the variation ID for SERVER_SIDE experiments in Google Optimize. Set 0 for original version.

### Create Only Fields

This plugin supports all optional Create Only Fields documented in [Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#create):

- `name`: string, tracker name
- `clientId`: string
- `sampleRate`: number
- `siteSpeedSampleRate`: number
- `alwaysSendReferrer`: boolean
- `allowAnchor`: boolean
- `cookieName`: string
- `cookieDomain`: string, defaults to `'auto'` if not given
- `cookieExpires`: number
- `storeGac`: boolean
- `legacyCookieDomain`: string
- `legacyHistoryImport`: boolean
- `allowLinker`: boolean

These fields can be specified in the plugin's `options` as shown in the [How to use](#how-to-use) section.
