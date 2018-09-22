const url = require('url')
const Renderer = require("./Renderer")
const {writeFile} = require('fs')
const {join, extname} = require('path')
const asyncHandler = require('express-async-handler')
const removeExtensionFromPath = require('./functions/removeExtensionFromPath')

function handleRequest(directory) {
  const renderer = new Renderer(directory)
  return asyncHandler(async (req, res, next) => {
    let path = url.parse(req.url).pathname
    const ext = extname(path) || ".html"
    path = removeExtensionFromPath(path)
    if (ext && !['.html', '.jsp'].includes(ext)) return next() // We don't handle other file extensions
    if (ext === '.jsp') ext = '.js' // Convert JSP (JavaScript Page) to actual JS extension
    if (path.includes('~') || path.includes("..")) throw new Error("Illegal Path Character")
    const [rawResponse, foundType] = await renderer.render(path, ext)
    if (rawResponse === null) return next()
    res.type('html').send(rawResponse)
    writeFile(join(directory, 'cache', path+foundType), rawResponse, err => {
      if (err) console.log(err)
    })
  })
}

module.exports = handleRequest
