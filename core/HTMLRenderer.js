const {join} = require('path')
const {accessSync} = require('fs')
const {sanitize} = require('sandhands')

class HTMLRenderer {
  constructor(directory) {
    this.rootDirectory = directory
    this.directory = join(directory, 'pages')
    try {
      accessSync(this.directory)
    } catch(err) {
      throw new Error("Missing /pages Directory")
    }
    this.pageMap = createPageMap(this.directory)
    this.render = this.render.bind(this)
  }
  render(path) {
    const {directory} = this
    if (path.includes('~') || path.includes("..")) throw new Error("Illegal Path Character")

  }
}

module.exports = HTMLRenderer
