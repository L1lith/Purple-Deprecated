#!/usr/bin/env node --harmony
const command = require('yargs').argv._[0]
const {sanitize, F} = require('sandhands')
const {join} = require('path')
const {accessSync} = require('fs')

if (!command) throw new Error("Missing Command Argument!")
sanitize(command, F(String).regex(/^[a-zA-Z]+$/))

const commandPath = join(__dirname, './commands/'+command+".js")

try {
  accessSync(commandPath)
} catch(err) {
  console.log(err)
  throw new Error(`The command ${command} does not exist. Try "purpl help"`)
}

require(commandPath)
