const {join} = require('path')
const createPageMap = require('./functions/createPageMap')

module.exports = createPageMap(join(PROJECT_DIRECTORY, 'pages/'))
