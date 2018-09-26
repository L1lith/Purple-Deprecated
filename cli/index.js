#!/usr/bin/env node --harmony
let command = require('yargs').argv._[0]
const {sanitize, F} = require('sandhands')
const {join} = require('path')
const {accessSync} = require('fs')

const commandAliases = {
  "run": "start",
  "create": "init"
}

if (commandAliases.hasOwnProperty(command)) command = commandAliases[command]

if (!command) throw new Error("Missing Command Argument!")
try {
  sanitize(command, F(String).regex(/^[a-zA-Z]+$/))
} catch(err) {
  throw "Malformed Command"
}

const commandPath = join(__dirname, './commands/'+command+".js")

try {
  accessSync(commandPath)
} catch(err) {
  console.log(err)
  throw new Error(`The command ${command} does not exist. Try "purple help"`)
}

require(commandPath)
