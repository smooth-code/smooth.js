import { applyHook } from '../browser'

export const onSelectContentFields = ({ fragmentName }) =>
  applyHook(
    'onSelectContentFields',
    { fields: [`...${fragmentName}`] },
    'fields',
  )
