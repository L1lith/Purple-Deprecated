const autoBind = require('auto-bind')
const {readFile, readFileSync} = require('fs-extra')
const {join, extname} = require('path')
const {accessSync} = require('fs')
const {sanitize} = require('sandhands')
const createPageMap = require('./createPageMap')
const removeExtensionFromPath = require('./functions/removeExtensionFromPath')
const routeOrder = require('route-order')

class Renderer {
  constructor(directory) {
    this.rootDirectory = directory
    this.directory = join(directory, 'pages')
    this.pageMap = createPageMap(this.directory)
    console.log(this.pageMap)
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
    const htmlMatches = this.matchPath(path, '.html')
    const htmlMatch = htmlMatches.sort(routeOrder())[0]
    if (!htmlMatch) {
      if (tryAsJavascript === true) return this.renderJS(matches, path, ext)
      return null
    }
    const rawHTML = await readFile(htmlMatch[0])
    const jsMatches = this.matchPath(path, '.js')
    if (jsMatches.length < 1) return [rawHTML, '.html']
    console.log("TODO: Render JSMatches: ", jsMatches)
  }
  async renderJS(matches) {

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
          matches.push([full, ext])
        }
      }
    }
    return matches
  }
}

module.exports = Renderer
