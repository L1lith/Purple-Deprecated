const {join} = require('path')
const {ProvidePlugin} = require('webpack')

const purpleModules = join(process.env.PURPLE_DIRECTORY, 'node_modules')
const projectModules = join(process.env.PROJECT_DIRECTORY, 'node_modules/')

module.exports = {
  mode: process.env.NODE_ENV || "development",
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'].map(preset => 'module:' + join(purpleModules, preset))
        }
      }
    }]
  },
  stats: {
    errorDetails: true
  },
  resolve: {
    modules: [projectModules],
    alias: {
      project: process.env.PROJECT_DIRECTORY
    }
  },
  plugins: [
    new ProvidePlugin({
      'React': 'react'
    })
  ]
}
