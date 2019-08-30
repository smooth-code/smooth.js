const common = {
  presets: ['@babel/preset-react'],
  plugins: [
    '@loadable/babel-plugin',
    '@babel/plugin-proposal-class-properties',
  ],
}

const nodeConfig = opts => ({
  ...common,
  presets: [
    ...common.presets,
    [
      '@babel/preset-env',
      {
        loose: true,
        useBuiltIns: 'entry',
        corejs: 3,
        targets: {
          node: 'current',
        },
        ...opts['preset-env'],
      },
    ],
  ],
})

const webConfig = opts => ({
  ...common,
  presets: [
    ...common.presets,
    [
      '@babel/preset-env',
      {
        modules: false,
        loose: true,
        useBuiltIns: 'entry',
        corejs: 3,
        ...opts['preset-env'],
      },
    ],
  ],
  plugins: [
    ...common.plugins,
    ['@babel/plugin-transform-runtime', opts['transform-runtime']],
  ],
})

function isWebTarget(caller) {
  return Boolean(caller && caller.name === 'babel-loader')
}

module.exports = (api, opts = {}) => {
  if (api.caller(isWebTarget)) {
    return webConfig(opts)
  }
  return nodeConfig(opts)
}
