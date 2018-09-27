const validateArgs = require('../validateArgs')
const mkdirp = require('mkdirp')
const {lstatSync, readdirSync} = require('fs')
const {join} = require('path')
const {ncp} = require('ncp')
const {exec} = require('child_process')
const {magenta, cyan, green, yellow} = require('chalk')

const templateDir = join(__dirname, '../../template')

const args = validateArgs({
  "directory": {
    aliases: ["d", "dir"],
    sanitize: String
  }
})


let directory = args.directory || args._[0] || "./Purple-Project"
let directoryDisplayName = directory
if (directory.startsWith('./')) directory = join(process.cwd(), directory)
mkdirp.sync(directory)
if (!lstatSync(directory).isDirectory()) throw "Path is not a directory"
if (readdirSync(directory).length > 0) throw "You must specify a non empty directory with the -d flag"

console.log(cyan(`Creating a new ${magenta("Purple")} Project!`))
ncp(templateDir, directory, err => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log("| " + cyan("Installing Dependencies..."))
  exec('npm install', {cwd: directory}, err => {
    if (err) {
      console.log(err)
      process.exit(1)
    }
    console.log("+- " + magenta("Done! ") + cyan(`Purple Project Created in ${green(directoryDisplayName)}!\nTo get started ${green("cd")} into the directory and run "${green("npm start")}".`))
  })
})
