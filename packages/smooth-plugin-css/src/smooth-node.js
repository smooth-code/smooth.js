import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export function onCreateWebpackConfig({ stage, actions }) {
  const dev = stage.startsWith('develop')
  actions.setWebpackConfig({
    plugins: [
      new MiniCssExtractPlugin({
        filename: dev ? '[name].css' : '[name]-bundle-[chunkhash:8].css',
        chunkFilename: dev ? '[id].css' : '[id]-bundle-[chunkhash:8].css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: dev,
              },
            },
            'css-loader',
          ],
        },
      ],
    },
  })
}
