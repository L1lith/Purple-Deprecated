const {sanitize} = require('sandhands')
const whitelistedArgs = ["_", '$0']

function validateArgs(allowedArguments) {
  const args = require('yargs').argv
  console.log(args)

  const aliasMap = {}

  Object.entries(allowedArguments).forEach(([key, {aliases=[]}]) => {
    aliases.forEach(alias => aliasMap[alias] = key)
  })

  Object.entries(args).forEach(([arg, value]) => {
    if (aliasMap.hasOwnProperty(arg)) arg = aliasMap[arg]
    if (whitelistedArgs.includes(arg)) return
    if (!allowedArguments.hasOwnProperty(arg)) throw new Error(`Invalid Argument "${arg}"`)
    const argumentDescription = allowedArguments[arg]
    if (argumentDescription.hasOwnProperty("sanitize")) sanitize(value, argumentDescription.sanitize)
  })

  return args
}

module.exports = validateArgs
