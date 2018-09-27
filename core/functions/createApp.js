const {isValidElement, createElement, cloneElement} = require('react')
const isReactComponent = require('./isReactComponent')
const matchPath = require('./matchPath')

function createAppComponent(reactElements, forServer) {
  if (typeof forServer != 'boolean') throw new Error("Internal Error: forServer must be a boolean")

  return createElement('div', {className: "purple-app"}, reactElements)
}

module.exports = createAppComponent
