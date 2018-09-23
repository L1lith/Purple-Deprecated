const {join} = require('path')

const serverDir = join(__dirname, '..')

module.exports = merge(require('./webpack.config.js', {
  target: "node",
  output: {
    path: join(__dirname, 'build')
  },
  entry: join(serverDir, "index.js"),
  context: serverDir
})
