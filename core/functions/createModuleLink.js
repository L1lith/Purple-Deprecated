const {join} = require('path')
const {writeFileSync} = require('fs')

const moduleLinkPath = join(__dirname, "../moduleLink")

function createModuleLink(modulePath) {
  writeFileSync(moduleLinkPath, `import module from "${moduleLinkPath}"\nexport default module`)
}

module.exports = createModuleLink
