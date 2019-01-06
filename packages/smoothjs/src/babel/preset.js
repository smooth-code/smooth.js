const common = {
  presets: ['@babel/preset-react'],
  plugins: [
    ['babel-plugin-module-resolver', { root: ['./src'] }],
    'babel-plugin-styled-components',
    '@loadable/babel-plugin',
    '@babel/plugin-proposal-class-properties',
  ],
}

const nodeConfig = {
  ...common,
  presets: [
    ...common.presets,
    [
      '@babel/preset-env',
      {
        loose: true,
        useBuiltIns: 'entry',
        targets: {
          node: 'current',
        },
      },
    ],
  ],
}

const webConfig = {
  ...common,
  presets: [
    ...common.presets,
    [
      '@babel/preset-env',
      {
        modules: false,
        loose: true,
        useBuiltIns: 'entry',
      },
    ],
  ],
}

function isWebTarget(caller) {
  return Boolean(caller && caller.name === 'babel-loader')
}

module.exports = api => {
  if (api.caller(isWebTarget)) {
    return webConfig
  }
  return nodeConfig
}
