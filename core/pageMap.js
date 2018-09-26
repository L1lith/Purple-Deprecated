const {join} = require('path')
const createPageMap = require('./functions/createPageMap')

module.exports = createPageMap(join(PURPLE_DIRECTORY, 'pages/'))
