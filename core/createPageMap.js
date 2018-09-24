const dir = require('node-dir')
const {relative, extname} = require("path")
const pathToRegexp = require('path-to-regexp')
const removeExtensionFromPath = require('./functions/removeExtensionFromPath')

const replaceIndexRegex = /(?<=(^|\/))index($|\/)/

function createPageMap(directory) {
  let files = dir.files(directory, {sync: true})
  const paths = []
  files = files.forEach(file => {
    let normalizedPath = removeExtensionFromPath(relative(directory, file)).replace(replaceIndexRegex, '')
    const regex = pathToRegexp(normalizedPath)
    if (file.endsWith('.js') || file.endsWith('.html')) {
      paths.push([regex, file, extname(file)])
    } else {
      throw new Error("Unexpected Extension Type in Pages")
    }
  })
  return paths
}

module.exports = createPageMap
