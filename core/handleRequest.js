const url = require('url')
const Renderer = require("./Renderer")
const {writeFile} = require('fs')
const {join, extname, dirname} = require('path')
const asyncHandler = require('express-async-handler')
const mkdirp = require('mkdirp')
const removeExtensionFromPath = require('./functions/removeExtensionFromPath')

const replaceIndexRegex = /(?<=(^|\/))index($|\/)/

function handleRequest(directory) {
  const renderer = new Renderer(directory)
  return asyncHandler(async (req, res, next) => {
    let path = url.parse(req.url).pathname
    let ext = extname(path) || ".html"
    path = removeExtensionFromPath(path).replace(replaceIndexRegex, '')
    if (ext && !['.html', '.jsp'].includes(ext)) return next() // We don't handle other file extensions
    if (ext === '.jsp') ext = '.js' // Convert JSP (JavaScript Page) to actual JS extension
    if (path.includes('~') || path.includes("..")) throw new Error("Illegal Path Character(s)")
    const [rawResponse, foundType] = await renderer.render(path, ext) || [null, null]
    if (rawResponse === null) return next()
    res.type(foundType.replace(/^\./, '')).send(rawResponse)
    const responsePath = join(directory, 'cache', path+foundType).replace(replaceIndexRegex, "index")
    mkdirp(dirname(responsePath), err => {
      if (err) return console.log(err)
      writeFile(responsePath, rawResponse, err => {
        if (err) console.log(err)
      })
    })
  })
}

module.exports = handleRequest
