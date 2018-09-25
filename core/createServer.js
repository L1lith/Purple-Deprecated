const express = require('express')
const mkdirp = require('mkdirp')
const {join} = require('path')
const {access} = require('fs-extra')
const handleRequest = require('./handleRequest')

async function createServer(directory) {
  const app = express()
  app.disable('x-powered-by')
  const staticDir = join(directory, 'static')
  try {
    await access(staticDir)
    app.use(express.static(staticDir))
  } catch(err) {}

  if (process.env.NODE_ENV === "production") { // Only Cache Responses in Production
    const cacheDir = join(directory, 'cache')
    mkdirp(cacheDir)
    app.use(express.static(cacheDir))
  }
  app.use(handleRequest(directory))

  // let serverHookPath = null
  // try {
  //   await access(join(directory, 'server.js'))
  //   serverHookPath = join(directory, 'server.js')
  // } catch(err) {
  //   try {
  //     await access(join(directory, 'server/index.js'))
  //     serverHookPath = join(directory, 'server/index.js')
  //   } catch(err) {}
  // }
  // if (serverHookPath) {
  //   let serverHook = require(serverHookPath)
  //   if (typeof serverHook != 'function') throw new Error("Server Hook Must Export a Function!")
  //   await serverHook(app)
  // }

  return app
}

module.exports = createServer
