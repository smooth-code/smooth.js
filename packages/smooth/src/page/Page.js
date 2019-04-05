import React, { useRef } from 'react'
import loadable from '@loadable/component'
import App from '__smooth_app'
import Content from '__smooth_content'
import { applyHook } from '../plugin/browser'
import { PageContextProvider } from './PageContext'
import { usePause } from '../router/HiddenRouter'

function getFileName(filePath) {
  return filePath.replace(/^\.\//, '').replace(/\.js$/, '')
}

function getIndexPath(isIndex, name) {
  return isIndex ? '/' : `/${name}`
}

function getRoutePath(isIndex, isWildCard, name) {
  if (isWildCard) return isIndex ? '/:slug*' : `/${name}/:slug+`
  return getIndexPath(isIndex, name)
}

function getPage(filePath) {
  const rawName = getFileName(filePath)
  const isWildCard = !rawName.endsWith('$')
  const name = rawName.replace('$', '')
  const isIndex = name === 'index'
  const indexPath = getIndexPath(isIndex, name)
  const routePath = getRoutePath(isIndex, isWildCard, name)
  const LoadableComponent = loadable.lib(() =>
    import(`__smooth_pages/${rawName}`),
  )
  return {
    isIndex,
    isWildCard,
    indexPath,
    routePath,
    filePath,
    LoadableComponent,
  }
}

// First content, then indexes
function sortPages(a, b) {
  if (a.isWildCard === b.isWildCard) {
    if (a.isIndex === b.isIndex) return 0
    return a.isIndex < b.isIndex ? -1 : 1
  }
  return a.isWildCard < b.isWildCard ? -1 : 1
}

export function getPages() {
  const req = require.context(process.env.__smooth_pages, true, /\.js$/, 'weak')
  return req
    .keys()
    .map(getPage)
    .sort(sortPages)
}

function getContentSlug({ match, history, location, pageRef }) {
  const { module: pageModule, isWildCard } = pageRef.current

  if (!isWildCard) {
    if (!pageModule.contentSlug) {
      return pageRef.current.routePath.replace(/^\//, '')
    }
    return typeof pageModule.contentSlug === 'function'
      ? pageModule.contentSlug({ history, location })
      : pageModule.contentSlug
  }

  return match.params.slug
}

function enrichPageRef(
  pageRef,
  { module: pageModule, indexUrl, match, history, location },
) {
  const isContent = Boolean(pageModule.contentFragment)
  pageRef.current.module = pageModule
  pageRef.current.isContent = isContent
  pageRef.current.indexUrl = indexUrl

  if (isContent) {
    pageRef.current.slug = getContentSlug({ match, history, location, pageRef })

    if (!pageRef.current.ContentComponent && !pageRef.current.PageComponent) {
      const ContentComponent = props => {
        const Component = pageRef.current.module.default
        const element = <Component {...props} />
        return applyHook('wrapContentElement', { element, props }, 'element')
      }
      const PageComponent = () => <Content Component={ContentComponent} />
      pageRef.current.ContentComponent = ContentComponent
      pageRef.current.PageComponent = PageComponent
    }
  } else {
    pageRef.current.PageComponent = pageModule.default
  }
}

function usePageRef(page) {
  return useRef({ ...page })
}

export default function Page({
  page,
  lang,
  indexUrl,
  history,
  match,
  location,
}) {
  const pageRef = usePageRef(page)
  const unpause = usePause()
  return (
    <page.LoadableComponent>
      {pageModule => {
        unpause()
        enrichPageRef(pageRef, {
          module: pageModule,
          indexUrl,
          match,
          history,
          location,
        })

        const pageContext = {
          lang,
          page: pageRef.current,
          history,
          match,
          location,
        }

        return (
          <PageContextProvider context={pageContext}>
            <App {...pageContext} Component={pageRef.current.PageComponent} />
          </PageContextProvider>
        )
      }}
    </page.LoadableComponent>
  )
}
