const core = require('../../core')
const validateArgs = require('../validateArgs')
const {access} = require('fs-extra')
const {dirname, join} = require('path')

const args = validateArgs({
  "directory": {
    aliases: ["d", "dir"],
    sanitize: String
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

core(directory, options)
