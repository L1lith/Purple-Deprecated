const {DefinePlugin} = require('webpack')
const merge = require('webpack-merge')
const {join} = require('path')

const serverDir = join(__dirname, '..')

module.exports = merge(require('./webpack.config.js'), {
  target: "node",
  output: {
    path: join(__dirname, 'build')
  },
  entry: ['@babel/polyfill', join(__dirname, "index.js")],
  context: serverDir,
  plugins: [
    new DefinePlugin({
        'PURPLE_DIRECTORY': `"${process.env.PURPLE_DIRECTORY}"`,
        'PURPLE_OPTIONS': process.env.PURPLE_OPTIONS
    })
  ]
})
