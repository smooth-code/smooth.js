import path from 'path'

module.exports = {
  plugins: [
    { resolve: 'smooth-plugin-head-meta' },
    {
      resolve: 'smooth-backend-wordpress',
      options: {
        basePath: path.join(__dirname, 'wordpress'),
        baseUrl: 'http://localhost:8000',
      },
    },
  ],
}
