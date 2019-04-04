/* eslint-env browser */
import React, { useCallback } from 'react'

export function OutboundLink({ href, eventLabel, target, onClick, ...props }) {
  const handleClick = useCallback(
    event => {
      const sameTarget = target !== '_blank'
      const normalClick = !(
        event.ctrlKey ||
        event.shiftKey ||
        event.metaKey ||
        event.button === 1
      ) // middleclick

      if (sameTarget && normalClick) {
        event.preventDefault()
        window.ga('send', 'event', {
          eventCategory: 'Outbound Link',
          eventAction: 'click',
          eventLabel: eventLabel || href,
          hitCallback() {
            window.location.href = href
          },
        })
      } else {
        window.ga('send', 'event', {
          eventCategory: 'Outbound Link',
          eventAction: 'click',
          eventLabel: eventLabel || href,
          transport: 'beacon',
        })
      }

      if (onClick) {
        onClick(event)
      }
    },
    [onClick, href, target, eventLabel],
  )

  if (props.target === '_blank') {
    props.rel = 'noopener noreferrer'
  }

  const rel =
    props.rel || (target === '_blank' ? 'noopener noreferrer' : undefined)
  return (
    <a href={href} onClick={handleClick} target={target} rel={rel} {...props} />
  )
}
