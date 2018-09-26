const {Component} = require('react')

function isReactComponent(data) {
  return Component.isPrototypeOf(data)
}

module.exports = isReactComponent
