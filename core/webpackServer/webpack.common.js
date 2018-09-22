const {join} = require('path')

const serverDir = join(__dirname, '..')

module.exports = {
  target: "node",
  entry: join(serverDir, "index.js"),
  context: serverDir,
  mode: process.env.NODE_ENV || "development",
  output: {
    path: join(__dirname, 'build')
  }
}
