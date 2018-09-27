const {isValidElement, createElement, cloneElement} = require('react')
const isReactComponent = require('./isReactComponent')

function createAppComponent(reactElements, path, forServer) {
  if (typeof path != 'string') throw new Error("Path must be a string")
  if (typeof forServer != 'boolean') throw new Error("Internal Error: forServer must be a boolean")
  reactElements = reactElements.map(element => {
    if (!isReactComponent(element)) return element
    return createElement(element, {global: {}, serverSide: forServer === true, clientSide: forServer === false, path})
  }).map((element, index) => cloneElement(element, {key: index}))
  return createElement('div', {className: "purple-app"}, reactElements)
}

module.exports = createAppComponent
