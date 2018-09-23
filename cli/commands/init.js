const validateArgs = require('../validateArgs')
const mkdirp = require('mkdirp')
const {lstatSync, readdirSync} = require('fs')
const {join} = require('path')
const {ncp} = require('ncp')

const templateDir = join(__dirname, '../../template')

const args = validateArgs({
  "directory": {
    aliases: ["d", "dir"],
    sanitize: String
  }
})


let directory = args.directory || args._[0] || "./Purple-Project"
if (directory.startsWith('./')) directory = join(process.cwd(), directory)
mkdirp.sync(directory)
if (!lstatSync(directory).isDirectory()) throw new Error("Path is not a directory")
if (readdirSync(directory).length > 0) throw new Error("You must specify a non empty directory with the -d flag")

ncp(templateDir, directory, err => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log("Purple Project Created!")
})
