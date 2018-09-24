const merge = require('webpack-merge')
const {join} = require('path')

const serverDir = join(__dirname, '..')

module.exports = merge(require('./webpack.config.js'), {
  target: "node",
  output: {
    path: join(__dirname, 'build')
  },
  entry: ['@babel/polyfill', join(serverDir, "/core/index.js")],
  context: serverDir
})
