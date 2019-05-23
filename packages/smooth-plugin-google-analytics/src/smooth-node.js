/* eslint-disable no-restricted-syntax, react/no-danger */
import React from 'react'
import { Minimatch } from 'minimatch'

const knownOptions = {
  clientId: `string`,
  sampleRate: `number`,
  siteSpeedSampleRate: `number`,
  alwaysSendReferrer: `boolean`,
  allowAnchor: `boolean`,
  cookieName: `string`,
  cookieExpires: `number`,
  storeGac: `boolean`,
  legacyCookieDomain: `string`,
  legacyHistoryImport: `boolean`,
  allowLinker: `boolean`,
}

exports.onRenderBody = (
  { setHeadComponents, setPostBodyComponents },
  options,
) => {
  // Lighthouse recommends pre-connecting to google analytics
  setHeadComponents([
    <link
      rel="preconnect dns-prefetch"
      key="preconnect-google-analytics"
      href="https://www.google-analytics.com"
    />,
  ])

  const excludeGAPaths = []
  if (typeof options.exclude !== 'undefined') {
    options.exclude.forEach(exclude => {
      const mm = new Minimatch(exclude)
      excludeGAPaths.push(mm.makeRe())
    })
  }

  const gaCreateOptions = {}
  for (const option in knownOptions) {
    // eslint-disable-next-line valid-typeof
    if (typeof options[option] === knownOptions[option]) {
      gaCreateOptions[option] = options[option]
    }
  }

  const setComponents = options.head ? setHeadComponents : setPostBodyComponents
  return setComponents([
    <script
      key="smooth-plugin-google-analytics"
      dangerouslySetInnerHTML={{
        __html: `
  ${
    excludeGAPaths.length
      ? `window.excludeGAPaths=[${excludeGAPaths.join(`,`)}];`
      : ``
  }
  ${
    typeof options.anonymize !== `undefined` && options.anonymize === true
      ? `function gaOptout(){document.cookie=disableStr+'=true; expires=Thu, 31 Dec 2099 23:59:59 UTC;path=/',window[disableStr]=!0}var gaProperty='${
          options.trackingId
        }',disableStr='ga-disable-'+gaProperty;document.cookie.indexOf(disableStr+'=true')>-1&&(window[disableStr]=!0);`
      : ``
  }
  if(${
    typeof options.respectDNT !== `undefined` && options.respectDNT === true
      ? `!(navigator.doNotTrack == "1" || window.doNotTrack == "1")`
      : `true`
  }) {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  }
  if (typeof ga === "function") {
    
    ga('create', '${options.trackingId}', '${
          typeof options.cookieDomain === `string`
            ? options.cookieDomain
            : `auto`
        }', ${
          typeof options.name === `string` ? `'${options.name}', ` : ``
        }${JSON.stringify(gaCreateOptions)});
      ${
        process.env.NODE_ENV !== 'production'
          ? `ga('set', 'sendHitTask', null);`
          : ''
      }
      ${
        typeof options.anonymize !== `undefined` && options.anonymize === true
          ? `ga('set', 'anonymizeIp', true);`
          : ``
      }
      ${
        typeof options.optimizeId !== `undefined`
          ? `ga('require', '${options.optimizeId}');`
          : ``
      }
      ${
        typeof options.experimentId !== `undefined`
          ? `ga('set', 'expId', '${options.experimentId}');`
          : ``
      }
      ${
        typeof options.variationId !== `undefined`
          ? `ga('set', 'expVar', '${options.variationId}');`
          : ``
      }}
      `,
      }}
    />,
  ])
}
