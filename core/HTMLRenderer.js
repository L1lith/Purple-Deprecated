const autoBind = require('auto-bind')
const {readFile, readFileSync} = require('fs-extra')
const {join, extname, resolve} = require('path')
const {accessSync} = require('fs')
const {sanitize} = require('sandhands')
const createPageMap = require('./createPageMap')
const removeExtensionFromPath = require('./functions/removeExtensionFromPath')
const routeOrder = require('route-order')
const {isValidElement} = require('react')
const jsRouteMap = require("./jsRouteMap")
const ReactDOMServer = require('react-dom/server')
const {JSDOM} = require("jsdom")
const pretty = require("pretty")

Object.entries(jsRouteMap).forEach(([route, output]) => {
  if (!isValidElement(output)) throw `Route "${route}" Must Export a valid React Element.`
})

class HTMLRenderer {
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
  async renderHTML(path) {
    const htmlPaths = this.matchPath(path, '.html')
    const htmlPath = htmlPaths.sort(routeOrder())[0]
    const rawHTML = htmlPath ? (await readFile(htmlPath)).toString() : null
    const rawJS = await this.renderJS(path)
    // TODO: Properly Merge html using root id
    let finalHTML = this.mergeHTMLJS(rawHTML, rawJS, path)
    if (!finalHTML.startsWith('<!DOCTYPE')) finalHTML = '<!DOCTYPE html>' + finalHTML
    return pretty(finalHTML)
  }
  async renderJS(path) {
    const jsPaths = this.matchPath(path, '.js').sort(routeOrder())
    if (jsPaths.length < 1) return null
    const reactElements = jsPaths.map(path => jsRouteMap[path])
    const rawHTML = reactElements.map(element => ReactDOMServer.renderToString(element)).join('\n')
    return rawHTML
  }
  mergeHTMLJS(html, js, path) {
    if (!html && !js) return null
    if (!html) return `<!DOCTYPE html>\n<html>\n<head>\n</head>\n\n<body>\n    <div id="root">${js}</div>\n</body>\n</html>`
    if (!js) {
      const dom = new JSDOM(html)
      const {document} = dom.window
      return document.documentElement.outerHTML // Ensure the proper HTML tags exist (html, body, head etc)
    }
    const dom = new JSDOM(html)
    const {document} = dom.window
    const {body} = document
    let root = document.getElementById("root")
    if (!root) { // Root not found, create new root
      root = document.createElement("div")
      root.id = 'root'
      body.appendChild(root)
    }
    root.innerHTML = js
    this.injectAppHook(document, path)

    return document.documentElement.outerHTML
  }
  injectAppHook(document, path) {
    const script = document.createElement("script")
    script.setAttribute("async", true)
    script.src = (path.endsWith('/') ? path + "index" : path) + ".jsp"
    document.head.appendChild(script)
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

module.exports = HTMLRenderer
