#!/usr/bin/env node
const command = require('yargs').argv._[0]
const {sanitize, F} = require('sandhands')

if (!command) throw new Error("Missing Command Argument!")
sanitize(command, F(String).regex(/^[a-zA-Z]+$/))

try {
  require('./commands/'+command+".js")
} catch(err) {
  throw new Error(`The command ${command} does not exist. Try "purpl help"`)
}
