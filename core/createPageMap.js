const dir = require('node-dir')
const {relative} = require("path")
const pathToRegexp = require('path-to-regexp')

const replaceIndexRegex = /(\/|^)index\.(js|html)$/

function createPageMap(directory) {
  let files = dir.files(directory, {sync: true})
  const paths = {js: [], html: []}
  files = files.forEach(file => {
    const regex = pathToRegexp(relative(directory, file).replace(replaceIndexRegex, "/"))
    if (file.endsWith('.js')) {
      paths.js.push([regex, file])
    } else if (file.endsWith('.html')) {
      paths.html.push([regex, file])
    }
  })
  return paths
}

module.exports = createPageMap
