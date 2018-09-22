const {join} = require('path')
const createServer = require('./createServer')

async function runPurpl(directory, options) {
  const app = await createServer(directory)
  options.port
}

module.exports = runPurpl
