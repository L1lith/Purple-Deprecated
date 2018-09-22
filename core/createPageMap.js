const dir = require('node-dir')
const {relative} = require("path")
const pathToRegexp = require('path-to-regexp')
const removeExtensionFromPath = require('./functions/removeExtensionFromPath')

const replaceIndexRegex = /(\/|^)index$/

function createPageMap(directory) {
  let files = dir.files(directory, {sync: true})
  const paths = {js: [], html: []}
  files = files.forEach(file => {
    const normalizedPath = removeExtensionFromPath(relative(directory, file).replace(replaceIndexRegex, "/"))
    const regex = pathToRegexp(normalizedPath)
    if (file.endsWith('.js')) {
      paths.js.push([regex, file])
    } else if (file.endsWith('.html')) {
      paths.html.push([regex, file])
    }
  })
  console.log(paths)
  return paths
}

module.exports = createPageMap
