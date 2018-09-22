const {sanitize} = require('sandhands')
const whitelistedArgs = ["_", '$0']

function validateArgs(allowedArguments) {
  const args = require('yargs').argv
  const output = {_: args._}

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
    output[arg] = value
  })

  Object.entries(allowedArguments).forEach(([arg, {required=false}]) => {
    if (required === true && !args.hasOwnProperty(arg)) throw new Error(`Missing "${arg}" Argument`)
  })

  return output
}

module.exports = validateArgs
