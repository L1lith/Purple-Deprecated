function removeExtensionFromPath(path) {
  return path.replace(/\.[a-zA-Z]+$/, '')
}

module.exports = removeExtensionFromPath
