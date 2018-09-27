const webpack = require("webpack")
const {dirname, join} = require('path')
const validateArgs = require('../validateArgs')
const createJSRouteMap = require('../functions/createJSRouteMap')
const {cyan, magenta} = require("chalk")

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
  options = require(join(directory, "package.json")).purple || {}
} catch(err) {
  console.warn("Warning: Package.json not found in target directory.")
}

options = {...options, ...args}
process.env.PURPLE_DIRECTORY = directory
process.env.PURPLE_OPTIONS = JSON.stringify(options)

console.log(cyan(`Starting ${magenta("Purple")}!`))

createJSRouteMap(join(directory, "pages/"))

const webpackConfig = require('../../core/webpack.server.js')

console.log("| "+ cyan("Building Server..."))
webpack(webpackConfig, (err, stats) => {
  if (err) return console.log(err)
  console.log("| " + cyan("Starting Server..."))
  require(join(root, 'core/build/main.js'))
})
