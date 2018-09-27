const {join} = require('path')
const createServer = require('./createServer')
const {cyan, magenta, green} = require('chalk')

async function runPurple(directory, {port=8040}) {
  const app = await createServer(directory)
  if (!port) throw new Error("Missing Port")
  await app.listen(port)
  console.log("+- " + magenta("Purple ") + cyan(`Server Running on Port #${green(port)}`))
}

runPurple(PROJECT_DIRECTORY, PURPLE_OPTIONS).catch(err => {
  console.log(err)
  process.exit(1)
})
