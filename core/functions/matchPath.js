const pageMap = require('../pageMap')
const removeExtensionFromPath = require('./removeExtensionFromPath')

function matchPath(path, targetExt=null) {
  path = removeExtensionFromPath(path)
  if (path.includes('~') || path.includes("..")) throw new Error("Illegal Path Character")
  if (typeof path != 'string') throw new Error("Invalid Path")
  if (targetExt !== null && typeof targetExt != 'string') throw new Error("Unexpected or missing type")
  const matches = []
  for (let i = 0; i < pageMap.length; i++) {
    const [regex, full, ext] = pageMap[i]
    if (targetExt === null || targetExt === ext) {
      if (regex.test(path)) {
        matches.push(targetExt === null ? [full, ext] : full)
      }
    }
  }
  return matches
}

module.exports = matchPath
