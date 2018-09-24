const webpack = require("webpack")
const {dirname, join} = require('path')
const validateArgs = require('../validateArgs')

const root = join(__dirname, '../../')

const args = validateArgs({
  "directory": {
    aliases: ["d", "dir"],
    sanitize: String
  },
  "port": {
    aliases: ["p"],
    sanitize: Number
  }
})

const directory = args.directory || process.cwd()

let options = {}
try {
  options = require(join(directory, "package.json")).purpl || {}
} catch(err) {
  console.warn("Warning: Package.json not found in target directory.")
}

options = {...options, ...args}
process.env.PURPLE_DIRECTORY = directory
process.env.PURPLE_OPTIONS = JSON.stringify(options)

const webpackConfig = require('../../core/webpack.server.js')

console.log("Building Webpack Server")
webpack(webpackConfig, (err, stats) => {
  if (err) return console.log(err)
  console.log("Starting Webpack Server")
  require(join(root, 'core/build/main.js'))
})
