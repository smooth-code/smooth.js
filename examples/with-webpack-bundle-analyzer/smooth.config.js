const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = {
  webpack: (config, { isServer }) => {
    if (isServer) return config
    return {
      ...config,
      plugins: [...config.plugins, new BundleAnalyzerPlugin()],
    }
  },
}
