const escapeForRegex = require("./escapeForRegex")

function convertPathToRegex(path) {
  let parts = path.split('/')
  parts = parts.map(part => {
    if (part.length < 1) return ''
    return part.split('**').map(str => str.split('*').map(escapeForRegex).join("[^/]*")).join(".*")
  })

  return new RegExp(`^${parts.join('\/')}$`, 'i')
}

module.exports = convertPathToRegex
