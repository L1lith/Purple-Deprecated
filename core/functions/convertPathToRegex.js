const escapeForRegex = require("./escapeForRegex")

const pathAliases = [
  ["**+", ".+"],
  ["*+", "[^/]+"],
  ["**", ".*"],
  ["*", "[^/]*"],
]

function convertPathToRegex(path) {
  path = path.split('#').filter((value, index) => index % 2  == 0).join('') // Allow Comments using the # Character.
  let parts = path.split('/').map(part => replaceIn(part, pathAliases))

  return new RegExp(`^${parts.join('\/')}$`, 'i')
}

function replaceIn(string, searches) {
  if (searches.length < 1) return escapeForRegex(string)
  const [alias, regex] = searches[0]
  return string.split(alias).map(part => replaceIn(part, searches.slice(1))).join(regex)
}

module.exports = convertPathToRegex
