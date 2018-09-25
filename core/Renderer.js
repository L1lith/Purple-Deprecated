const autoBind = require('auto-bind')
const {readFile, readFileSync} = require('fs-extra')
const {join, extname, resolve} = require('path')
const {accessSync} = require('fs')
const {sanitize} = require('sandhands')
const createPageMap = require('./createPageMap')
const removeExtensionFromPath = require('./functions/removeExtensionFromPath')
const routeOrder = require('route-order')
const {isValidElement} = require('react')
const babelOptions = require('./babelOptions')
const transform = require("@babel/core")
const jsRouteMap = require("./jsRouteMap")
const ReactDOMServer = require('react-dom/server')

Object.entries(jsRouteMap).forEach(([route, output]) => {
  if (!isValidElement(output)) throw `Route "${route}" Must Export a valid React Element.`
})

class Renderer {
  constructor(directory) {
    this.rootDirectory = directory
    this.directory = join(directory, 'pages')
    this.pageMap = createPageMap(this.directory)
    try {
      accessSync(this.directory)
    } catch(err) {
      throw new Error("Missing /pages Directory")
    }
    autoBind(this)
  }
  async render(path, ext) {
    if (path.startsWith('/')) path = path.substring(1)
    if (ext === null || ext === '.html') {
      return this.renderHTML(path, ext === null)
    } else if (ext === '.js') {
      return this.renderJS(path)
    } else {
      throw new Error(`Unexpected Extension ${ext}`)
    }
    //return [rawHTML, '.html']
  }
  async renderHTML(path, tryAsJavascript=false) {
    const htmlPaths = this.matchPath(path, '.html')
    const htmlPath = htmlPaths.sort(routeOrder())[0]
    if (!htmlPath) {
      if (tryAsJavascript === true) return this.renderJSAsHTML(path, ext)
      return null
    }
    const rawHTML = (await readFile(htmlPath)).toString()
    const rawJS = await this.renderJSAsHTML(path)
    console.log(rawHTML, rawJS)
    return rawHTML + (rawJS || "")
  }
  async renderJSAsHTML(path) {
    const jsPaths = this.matchPath(path, '.js').sort(routeOrder())
    if (jsPaths.length < 1) return null
    const reactElements = jsPaths.map(path => jsRouteMap[path])
    const rawHTML = reactElements.map(element => ReactDOMServer.renderToString(element)).join('\n')
    return rawHTML
  }
  matchPath(path, targetExt=null) {
    path = removeExtensionFromPath(path)
    if (path.includes('~') || path.includes("..")) throw new Error("Illegal Path Character")
    if (typeof path != 'string') throw new Error("Invalid Path")
    if (targetExt !== null && typeof targetExt != 'string') throw new Error("Unexpected or missing type")
    const matches = []
    for (let i = 0; i < this.pageMap.length; i++) {
      const [regex, full, ext] = this.pageMap[i]
      if (targetExt === null || targetExt === ext) {
        if (regex.test(path)) {
          matches.push(targetExt === null ? [full, ext] : full)
        }
      }
    }
    return matches
  }
}

module.exports = Renderer
