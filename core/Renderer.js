const autoBind = require('auto-bind')
const {readFile, readFileSync} = require('fs-extra')
const {join, extname} = require('path')
const {accessSync} = require('fs')
const {sanitize} = require('sandhands')
const createPageMap = require('./createPageMap')
const removeExtensionFromPath = require('./functions/removeExtensionFromPath')

class Renderer {
  constructor(directory) {
    this.rootDirectory = directory
    this.directory = join(directory, 'pages')
    try {
      accessSync(this.directory)
    } catch(err) {
      throw new Error("Missing /pages Directory")
    }
    autoBind(this)
  }
  async render(path) {
    const ext = extname(path) || null
    if (ext && !['html', 'jsp'].includes(ext)) return null
    const match = matchPath(path, ext)
  }
  // async renderHTML(path) {
  //   const fullHTMLPath = this.matchPath(path, 'html')
  //   let rawHTML
  //   if (fullHTMLPath === null) {
  //     if (this.standardHTML) {
  //       rawHTML = this.standardHTML
  //     } else {
  //       rawHTML = null
  //     }
  //   } else {
  //     rawHTML = await readFile(fullHTMLPath)
  //   }
  //   const fullJSPath = this.matchPath(path, 'js')
  //   if (fullJSPath === null) return rawHTML
  //   return rawHTML
  // }
  matchPath(path, type=null) {
    path = removeExtensionFromPath(path)
    if (path.includes('~') || path.includes("..")) throw new Error("Illegal Path Character")
    if (typeof path != 'string' || path.length < 1) throw new Error("Invalid Path")
    if (type !== null && typeof type != 'string') throw new Error("Unexpected or missing type")
    const matches = []
    for (let i = 0; i < this.pageMap.length; i++) {
      const [regex, full, ext] = this.pageMap[i]
      if (regex.test(path)) {
        if (!type || type === ext) {
          matches.push([full, ext])
        }
      }
    }
    if (matches.length < 1) return null
    return matches
  }
}

module.exports = Renderer
