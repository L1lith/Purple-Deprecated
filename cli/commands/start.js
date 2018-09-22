const validateArgs = require('../validateArgs')
const {access} = require('fs-extra')
const {dirname} = require('path')

const args = validateArgs({
  "directory": {
    aliases: ["d", "dir"],
    sanitize: String
  }
})

const directory = args.directory || process.cwd()
