const {join} = require('path')
const {accessSync} = require('fs')
const {sanitize} = require('sandhands')
const createPageMap = require('./createPageMap')
const {readFile} = require('fs-extra')

class Renderer {
  constructor(directory) {
    this.rootDirectory = directory
    this.directory = join(directory, 'pages')
    try {
      accessSync(this.directory)
    } catch(err) {
      throw new Error("Missing /pages Directory")
    }
    this.pageMap = createPageMap(this.directory)
    this.renderHTML = this.renderHTML.bind(this)
    this.renderJS = this.renderJS.bind(this)
    this.matchPath = this.matchPath.bind(this)
  }
  async renderHTML(path) {
    const fullPath = this.matchPath(path, 'html')
    if (fullPath === null) return null
    const rawHTML = (await readFile(fullPath)).toString()
    
  }
  async renderJS() {
    const fullPath = this.matchPath(path, 'html')
    if (fullPath === null) return null

  }
  matchPath(path, type) {
    if (path.includes('~') || path.includes("..")) throw new Error("Illegal Path Character")
    if (typeof path != 'string' || path.length < 1) throw new Error("Invalid Path")
    if (typeof type != 'string' || !this.pageMap.hasOwnProperty(type)) throw new Error("Unexpected or missing type")
    const tests = this.pageMap[type]
    for (let i = 0; i < tests.length; i++) {
      const [regex] = tests[i]
      if (regex.test(path)) return tests[i][1]
    }
    return null
  }
}

module.exports = Renderer
