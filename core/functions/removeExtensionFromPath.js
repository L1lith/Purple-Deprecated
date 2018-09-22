function removeExtensionFromPath(path) {
  return path.replace(/\..+$/, '')
}

module.exports = removeExtensionFromPath
