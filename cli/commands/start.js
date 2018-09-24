const core = require('../../core')
const validateArgs = require('../validateArgs')
const {dirname, join} = require('path')

const args = validateArgs({
  "directory": {
    aliases: ["d", "dir"],
    sanitize: String
  },
  "port": {
    aliases: ["p"],
    sanitize: Number
  }
})

const directory = args.directory || process.cwd()

let options = {}
try {
  options = require(join(directory, "package.json")).purpl || {}
} catch(err) {
  console.warn("Warning: Package.json not found in target directory.")
}

options = {...options, ...args}
process.env.PURPLE_DIRECTORY = directory

core(directory, options).catch(err => {
  console.log(err)
  process.exit(1)
})
