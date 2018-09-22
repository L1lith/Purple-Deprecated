const dir = require('node-dir')
const {relative, extname} = require("path")
const pathToRegexp = require('path-to-regexp')

const replaceIndexRegex = /(\/|^)index.[a-zA-Z]+$/

function createPageMap(directory) {
  let files = dir.files(directory, {sync: true})
  const paths = []
  files = files.forEach(file => {
    const normalizedPath = relative(directory, file).replace(replaceIndexRegex, "/")
    const regex = pathToRegexp(normalizedPath)
    if (file.endsWith('.js') || file.endsWith('.html')) {
      paths.push([regex, file, extname(file)])
    } else {
      throw new Error("Unexpected Extension Type in Pages")
    }
  })
  console.log(paths)
  return paths
}

module.exports = createPageMap
