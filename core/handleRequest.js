const url = require('url')
const HTMLRenderer = require("./HTMLRenderer")
const {writeFile} = require('fs')
const {join, extname, dirname} = require('path')
const asyncHandler = require('express-async-handler')
const mkdirp = require('mkdirp')
const removeExtensionFromPath = require('./functions/removeExtensionFromPath')

const replaceIndexRegex = /(?<=(^|\/))index($|\/)/

function handleRequest(directory) {
  const pageRenderer = new HTMLRenderer(directory)
  return asyncHandler(async (req, res, next) => {
    let path = url.parse(req.url).pathname
    const ext = extname(path) || ".html"
    path = removeExtensionFromPath(path).replace(replaceIndexRegex, '')
    if (ext && !['.html', '.jsp'].includes(ext)) return next() // We don't handle other file extensions
    if (path.includes('~') || path.includes("..")) throw new Error("Illegal Path Character(s)")
    if (!ext || ext === '.html') {
      const rawResponse = (await pageRenderer.renderHTML(path)) || null
      if (rawResponse === null) return next()
      res.type('.html').send(rawResponse)
      if (process.env.NODE_ENV === "production") { // Only Cache Responses in Production
        const responsePath = join(directory, 'cache', (path.endsWith('/') ? path + "index" : path)+(ext || '.html')).replace(replaceIndexRegex, "index")
        mkdirp(dirname(responsePath), err => {
          if (err) return console.log(err)
          writeFile(responsePath, rawResponse, err => {
            if (err) console.log(err)
          })
        })
      }
    } else if (ext === '.jsp') {
      // TODO: Serve Javascript to Hydrate Page
    }
  })
}

module.exports = handleRequest
