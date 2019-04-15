import React from 'react'
import GlobalScript from './GlobalScript'

export default function SmoothError({ error }) {
  return (
    <GlobalScript
      varName="__SMOOTH_ERROR__"
      json={
        error
          ? {
              name: error.name,
              statusCode: error.statusCode,
              stack: error.stack,
              message: error.message,
            }
          : null
      }
    />
  )
}
