const autoBind = require('auto-bind')
const {readFile} = require('fs-extra')
const {join, extname, resolve} = require('path')
const {accessSync} = require('fs')
const {sanitize} = require('sandhands')
const routeOrder = require('route-order')
const removeExtensionFromPath = require('./functions/removeExtensionFromPath')
const {isValidElement, createElement, cloneElement} = require('react')
const isReactComponent = require('./functions/isReactComponent')
const ReactDOMServer = require('react-dom/server')
const {JSDOM} = require("jsdom")
const createApp = require('./functions/createApp')
const matchPath = require('./functions/matchPath')
const jsRouteMap = require("./jsRouteMap")

Object.entries(jsRouteMap).forEach(([route, output]) => {
  if (!isValidElement(output) && !isReactComponent(output)) throw new Error(`Route "${route}" must export a valid React Component or Element.`)
})

class HTMLRenderer {
  constructor() {
    autoBind(this)
  }
  async renderHTML(path) {
    const htmlPaths = matchPath(path, '.html')
    let rawHTML = null
    if (htmlPaths.length > 0) {
      rawHTML = ""
      for (let i = 0; i < htmlPaths.length; i++) {
        rawHTML += (await readFile(htmlPaths[i])).toString()
      }
    }
    const rawJS = await this.renderJS(path)
    // TODO: Properly Merge html using root id
    let finalHTML = this.mergeHTMLJS(rawHTML, rawJS, path)
    if (finalHTML === null) return null
    if (!finalHTML.startsWith('<!DOCTYPE')) finalHTML = '<!DOCTYPE html>\n' + finalHTML
    return finalHTML
  }
  async renderJS(path) {
    const paths = matchPath(path, '.js').sort(routeOrder())
    if (paths.length < 1) return null
    const reactElements = paths.map(path => jsRouteMap[path])
    return ReactDOMServer.renderToString(createApp(reactElements, path, true))
  }
  mergeHTMLJS(html, js, path) {
    if (!html && !js) return null
    if (!html) return `<!DOCTYPE html>\n<html>\n<head>\n    <script src="${path}.js" defer="defer"></script>\n</head>\n\n<body>\n    <div id="root">${js}</div>\n</body>\n</html>`
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
    script.setAttribute("defer", "defer")
    script.src = (path.endsWith('/') ? path + "index" : path) + ".js"
    document.head.appendChild(script)
  }
}

module.exports = HTMLRenderer
