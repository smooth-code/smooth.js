import React from 'react'
import loadable from 'smooth-core/loadable'

const DynamicComponent = loadable(() =>
  import('../components/DynamicComponent'),
)

export default () => (
  <div>
    Initial
    <DynamicComponent />
  </div>
)
