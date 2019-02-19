import path from 'path'

module.exports = {
  plugins: [
    {
      resolve: require.resolve('smooth-backend-wordpress'),
      options: {
        basePath: path.join(__dirname, 'wordpress'),
        baseUrl: 'http://localhost:8000',
      },
    },
  ],
}
