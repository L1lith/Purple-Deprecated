const {join} = require('path')
const projectModules = join(process.env.PURPLE_DIRECTORY, 'node_modules/')
require(join(projectModules, 'babel-plugin-require-context-hook/register'))()

module.exports = {
  mode: process.env.NODE_ENV || "development",
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'].map(preset => 'module:' + join(projectModules, preset)),
          plugins: ["transform-es2015-modules-commonjs", '@babel/plugin-syntax-dynamic-import', 'require-context-hook']
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
      project: process.env.PURPLE_DIRECTORY
    }
  }
}
