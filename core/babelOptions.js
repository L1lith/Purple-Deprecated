const {join} = require('path')
const projectModules = join(process.env.PURPLE_DIRECTORY, 'node_modules/')

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'].map(preset => 'module:' + join(projectModules, preset)),
  plugins: ["transform-es2015-modules-commonjs", '@babel/plugin-syntax-dynamic-import', 'require-context-hook']
}
