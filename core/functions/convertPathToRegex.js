const escapeForRegex = require("./escapeForRegex")

const pathAliases = [
  ["**+", ".+"],
  ["*+", "[^/]+"],
  ["**", ".*"],
  ["*", "[^/]*"],
]

function convertPathToRegex(path) {
  let parts = path.split('/').map(part => replaceIn(part, pathAliases))

  return new RegExp(`^${parts.join('\/')}$`, 'i')
}

function replaceIn(string, searches) {
  if (searches.length < 1) return escapeForRegex(string)
  const [alias, regex] = searches[0]
  return string.split(alias).map(part => replaceIn(part, searches.slice(1))).join(regex)
}

module.exports = convertPathToRegex
