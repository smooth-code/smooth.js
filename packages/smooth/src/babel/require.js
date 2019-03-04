import register, { revert } from '@babel/register'
import preset from './preset'

export default function babelRequire(path) {
  register({ presets: [preset] })
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const mod = require(path)
  revert()
  return mod
}
