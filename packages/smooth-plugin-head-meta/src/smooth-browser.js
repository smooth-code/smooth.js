/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
import React from 'react'
import Helmet from 'react-helmet'

function HeadMeta({ headMeta }) {
  if (!headMeta) return null
  return (
    <Helmet>
      {headMeta.title && <title>{headMeta.title}</title>}
      {headMeta.description && (
        <meta name="description" content={headMeta.description} />
      )}
      {headMeta.ogType && <meta name="og:type" content={headMeta.ogType} />}
      {headMeta.ogTitle && <meta name="og:title" content={headMeta.ogTitle} />}
      {headMeta.ogDescription && (
        <meta name="og:description" content={headMeta.ogDescription} />
      )}
      {headMeta.ogImage && (
        <meta name="og:image" content={headMeta.ogImage.url} />
      )}
      {headMeta.twitterCard && (
        <meta name="twitter:card" content={headMeta.twitterCard} />
      )}
      {headMeta.twitterTitle && (
        <meta name="twitter:title" content={headMeta.twitterTitle} />
      )}
      {headMeta.twitterDescription && (
        <meta
          name="twitter:description"
          content={headMeta.twitterDescription}
        />
      )}
      {headMeta.twitterImage && (
        <meta name="twitter:image" content={headMeta.twitterImage.url} />
      )}
      {headMeta.customMetas &&
        headMeta.customMetas.map((meta, index) => (
          <meta key={index} name={meta.name} content={meta.content} />
        ))}
    </Helmet>
  )
}

export function wrapContentElement({ element, props }) {
  return (
    <>
      <HeadMeta headMeta={props.headMeta} />
      {element}
    </>
  )
}

export function onSelectContentFields({ fields }) {
  return [
    ...fields,
    /* GraphQL */ `
headMeta {
  title
  description
  ogType
  ogTitle
  ogDescription
  ogImage {
    url
  }
  twitterCard
  twitterTitle
  twitterDescription
  twitterImage {
    url
  }
  customMetas {
    name
    content
  }
}
  `,
  ]
}
