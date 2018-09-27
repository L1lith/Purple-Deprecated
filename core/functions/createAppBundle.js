const {join, relative, dirname} = require('path')
const matchPath = require('./matchPath')
const {writeFile, readFile} = require('fs-extra')
const webpack = require('webpack')
const merge = require('webpack-merge')
const mkdirp = require('mkdirp')

const appSources = join(PURPLE_DIRECTORY, 'core/appSources')
const baseConfig = merge(require('../webpack.common.js'), require(`../webpack.${process.env.NODE_ENV || "development"}.js`), require('../webpack.client.js')) // Can't Use Packenv Inside Webpack

async function createAppBundle(path) {
  const sourcePath = join(appSources, (path.endsWith('/') ? path + 'index' : path) + ".js")
  const jsPaths = matchPath(path, '.js')
  if (jsPaths.length < 1) return null
  mkdirp(dirname(sourcePath))
  await writeFile(sourcePath, generateSourceCode(jsPaths))
  const parentFolder = join(PROJECT_DIRECTORY, 'cache', path.substring(0, path.lastIndexOf('/')))
  const filename = (path.endsWith('/') ? "index" : path.split("/").slice(-1)[0]) + ".js"
  const webpackConfigOptions = {
    entry: [sourcePath],
    context: PURPLE_DIRECTORY,
    output: {
      path: parentFolder,
      filename
    }
  }
  const config = merge(baseConfig, webpackConfigOptions)
  await (new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) return reject(err)
      const info = stats.toJson();

      if (stats.hasErrors()) {
        if (info.errors.length > 1) console.log(...info.errors.slice(1))
        return reject(info.errors[0])
      }
      if (stats.hasWarnings()) {
        console.warn(...info.warnings)
      }
      resolve()
    })
  }))
  return await readFile(join(parentFolder, filename))
}

function generateSourceCode(jsPaths) {
  //return "console.log('hi')"
  return (
`import ReactDOM from 'react-dom'
import createApp from '${PURPLE_DIRECTORY}/core/functions/createApp'
${jsPaths.map((path, index) => "import element"+ index + ' from "' + path + '"').join('\n')}
const elements = [${jsPaths.map((path, index) => "element" + index)}]
const app = createApp(elements, window.location.pathname, false)
const root = document.getElementById("root")
if (!root) throw new Error("Couldn't Find Application DOM Root")
ReactDOM.hydrate(app, root)
console.log("Application Launched")`
  )
}

module.exports = createAppBundle
