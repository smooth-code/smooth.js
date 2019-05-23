/* eslint-env browser */
export function onRouteUpdate({ location }) {
  // Don't track while developing.
  if (typeof ga !== 'function') return

  if (
    location &&
    typeof window.excludeGAPaths !== 'undefined' &&
    window.excludeGAPaths.some(rx => rx.test(location.pathname))
  ) {
    return
  }

  // wrap inside a timeout to make sure react-helmet is done with it's changes (https://github.com/gatsbyjs/gatsby/issues/9139)
  // reactHelmet is using requestAnimationFrame so we should use it too: https://github.com/nfl/react-helmet/blob/5.2.0/src/HelmetUtils.js#L296-L299
  function sendPageView() {
    window.ga('set', {
      page: location
        ? location.pathname + location.search + location.hash
        : undefined,
      title: document.title,
    })
    window.ga('send', 'pageview')
  }

  if ('requestAnimationFrame' in window) {
    requestAnimationFrame(() => {
      requestAnimationFrame(sendPageView)
    })
  } else {
    // simulate 2 rAF calls
    setTimeout(sendPageView, 32)
  }
}
