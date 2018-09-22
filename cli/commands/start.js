const validateArgs = require('../validateArgs')

const args = validateArgs({
  "directory": {
    aliases: ["d", "dir"],
    sanitize: Number
  }
})
