const {join} = require('path')
const createServer = require('./createServer')

async function runPurpl(directory, {port}) {
  const app = await createServer(directory)
  if (!port) throw new Error("Missing Port")
  await app.listen(port)
  console.log(`Purpl Server Running on Port ${port}`)
}

module.exports = runPurpl
