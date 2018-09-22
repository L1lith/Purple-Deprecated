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
    try {
      accessSync(this.directory)
    } catch(err) {
      throw new Error("Missing /pages Directory")
    }
    autoBind(this)
  }
  async render(path, ext) {
    if (path.startsWith('/')) path = path.substring(1)
    if (ext === '.html') ext = null // We need both JS and HTML matches for HTML rendering
    const matches = this.matchPath(path, ext).sort(routeOrder())

    if (matches.length < 1) return null
    if (!ext || ext === '.html') {
      return this.renderHTML(matches, path, ext)
    } else if (ext === '.js') {
      return this.renderJS(matches, path, ext)
    } else {
      throw new Error(`Unexpected Extension ${ext}`)
    }
    //return [rawHTML, '.html']
  }
  async renderHTML(matches, path, ext) {
    const htmlMatch = matches.filter(page => page[1] === '.html')[0]
    if (!htmlMatch) {
      if (!ext) {
        return this.renderJS(matches, path, ext)
      } else {
        return null
      }
    }
    const rawHTML = await readFile(htmlMatch[0])
    return [rawHTML, '.html']
  }
  async renderJS(matches) {

  }
  matchPath(path, targetExt=null) {
    path = removeExtensionFromPath(path)
    if (path.includes('~') || path.includes("..")) throw new Error("Illegal Path Character")
    if (typeof path != 'string' || path.length < 1) throw new Error("Invalid Path")
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
