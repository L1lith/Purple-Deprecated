const {join} = require('path')
const createServer = require('./createServer')

async function runPurple(directory, {port=8040}) {
  const app = await createServer(directory)
  if (!port) throw new Error("Missing Port")
  await app.listen(port)
  console.log(`Purple Server Running on Port ${port}`)
}

runPurple(PURPLE_DIRECTORY, PURPLE_OPTIONS).catch(console.log)
