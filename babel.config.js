module.exports = {
  presets: [
    '@babel/preset-react',
    ['@babel/preset-env', { loose: true, targets: { node: 8 } }],
  ],
  plugins: [
    '@loadable/babel-plugin',
    '@babel/plugin-proposal-class-properties',
  ],
}
