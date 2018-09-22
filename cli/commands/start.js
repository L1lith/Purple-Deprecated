const validateArgs = require('../validateArgs')
const {access} = require('fs-extra')

const args = validateArgs({
  "directory": {
    aliases: ["d", "dir"],
    sanitize: String,
    required: true
  }
})

const {directory} = args
