const {join} = require('path')
const createServer = require('./createServer')

async function runPurpl(directory, args) {
  const app = await createServer(directory)
}

module.exports = runPurpl
