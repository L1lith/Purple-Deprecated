const readDirDeep = require('read-dir-deep')
const {join} = require('path')
const {writeFileSync} = require('fs')

async function createJSRouteMap(directory) {
  const routes = readDirDeep.sync(directory).filter(file => file.endsWith('.js')).map(route => join(directory, route))
  const rawJSMap = createRawJSMap(routes)
  writeFileSync(join(__dirname, "../../core/jsRouteMap.js"), rawJSMap)
}

function createRawJSMap(routes) {
return (
`const routes = {
${routes.map(route => `    "${route}": require("${route}")`).join(',\n')}
}

Object.entries(routes).forEach(([route, output]) => {
  if (typeof output == 'object' && output.hasOwnProperty('default')) routes[route] = output.default
})

module.exports = routes`)
}

module.exports = createJSRouteMap
