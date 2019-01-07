import React from 'react'
import Context from './Context'
import GlobalScript from './GlobalScript'

export default function MainScript() {
  return (
    <Context.Consumer>
      {({ apolloState, error, extractor }) => (
        <>
          <GlobalScript varName="__APOLLO_STATE__" json={apolloState} />
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
          {extractor.getScriptElements()}
        </>
      )}
    </Context.Consumer>
  )
}
