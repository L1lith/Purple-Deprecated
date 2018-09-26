const routeOrder = require('route-order')
const {isValidElement, createElement, cloneElement} = require('react')
const isReactComponent = require('./isReactComponent')
const matchPath = require('./matchPath')
const jsRouteMap = require("../jsRouteMap")

Object.entries(jsRouteMap).forEach(([route, output]) => {
  if (!isValidElement(output) && !isReactComponent(output)) throw new Error(`Route "${route}" must export a valid React Component or Element.`)
})

function createAppComponent(path) {
  const paths = matchPath(path, '.js').sort(routeOrder())
  if (paths.length < 1) return null
  const reactElements = paths.map(path => jsRouteMap[path]).map(element => {
    if (!isReactComponent(element)) return element
    return createElement(element, {global: {}, serverSide: true, clientSide: false, path})
  }).map((element, index) => cloneElement(element, {key: index}))
  return createElement('div', {className: "purple-app"}, reactElements)
}

module.exports = createAppComponent
