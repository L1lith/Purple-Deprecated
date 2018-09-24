const {join} = require('path')
const purpleModules = join(__dirname,'../node_modules')

module.exports = {
  mode: process.env.NODE_ENV || "development",
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react']
        }
      }
    }]
  },
  resolve: {
    modules: [join(process.env.PURPLE_DIRECTORY, 'node_modules/')]
  }
}
