const merge = require('webpack-merge')
const packenv = require('packenv')
const {join} = require('path')

module.exports = merge(packenv(__dirname), {
  target: "web",
})
