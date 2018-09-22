const {join} = require('path')
const {accessSync} = require('fs')
const {sanitize} = require('sandhands')
const createPageMap = require('./createPageMap')

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
    console.log(this.pageMap)
    this.renderHTML = this.renderHTML.bind(this)
    this.renderJS = this.renderJS.bind(this)
  }
  renderHTML(path) {
    const {directory} = this
    if (path.includes('~') || path.includes("..")) throw new Error("Illegal Path Character")

  }
  renderJS() {

  }
}

module.exports = Renderer
