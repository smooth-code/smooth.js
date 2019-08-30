module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      { modules: false, loose: true, targets: { node: 8 } },
    ],
  ],
  plugins: [
    '@loadable/babel-plugin',
    '@babel/plugin-transform-modules-commonjs',
    '@babel/plugin-proposal-class-properties',
  ],
}
