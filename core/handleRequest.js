const url = require('url')
const Renderer = require("./Renderer")
const {writeFile} = require('fs')
const {join} = require('path')
const asyncHandler = require('express-async-handler')

function handleRequest(directory) {
  const renderer = new Renderer(directory)
  return asyncHandler(async (req, res, next) => {
    let path = url.parse(req.url).pathname
    if (path.includes('~') || path.includes("..")) throw new Error("Illegal Path Character")
    renderer.render(path)
  })
}

module.exports = handleRequest
