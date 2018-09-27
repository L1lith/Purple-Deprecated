const {join, relative} = require('path')
const matchPath = require('./matchPath')
const {writeFile} = require('fs-extra')
const webpack = require('webpack')
const merge = require('webpack-merge')

const appSources = join(PURPLE_DIRECTORY, 'core/appSources')
const baseConfig = merge(require('../webpack.common.js'), require(`../webpack.${process.env.NODE_ENV || "development"}.js`), require('../webpack.client.js')) // Can't Use Packenv Inside Webpack

async function createAppBundle(path) {
  const sourcePath = join(appSources, (path.endsWith('/') ? path + 'index' : path) + ".js")
  const jsPaths = matchPath(path, '.js')
  if (jsPaths.length < 1) return null
  await writeFile(sourcePath, generateSourceCode(jsPaths))
  const webpackConfigOptions = {
    entry: [sourcePath],
    context: PURPLE_DIRECTORY,
    output: {
      path: join(PROJECT_DIRECTORY, 'cache', path),
      filename: (path.endsWith('/') ? "index" : path.split("/").slice(-1)[0]) + ".js"
    }
  }
  const config = merge(baseConfig, webpackConfigOptions)
  console.log(config)
  await (new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) return reject(err)
      console.log('Built!')
    })
  }))
}

function generateSourceCode(jsPaths) {
  return (
`const createApp = require('../functions/createApp')
const elements = [${jsPaths.map(path => `require("${path}")`).join(', ')}]
const app = createApp(elements, false)
console.log(app)`
  )
}

module.exports = createAppBundle
