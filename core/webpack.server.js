const {DefinePlugin} = require('webpack')
const merge = require('webpack-merge')
const {join} = require('path')
const baseWebpackConfig = require('./webpack.config.js')
const nodeExternals = require('webpack-node-externals')

const serverDir = join(__dirname, '..')

module.exports = merge(baseWebpackConfig, {
  target: "node",
  output: {
    path: join(__dirname, 'build')
  },
  entry: ['@babel/polyfill', join(__dirname, "index.js")],
  context: serverDir,
  plugins: [
    new DefinePlugin({
        'PROJECT_DIRECTORY': `"${process.env.PROJECT_DIRECTORY}"`,
        'PURPLE_DIRECTORY': `"${serverDir}"`,
        'PURPLE_OPTIONS': process.env.PURPLE_OPTIONS,
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
    })
  ],
  externals: [nodeExternals()]
})
