const url = require('url')
const HTMLRenderer = require("./HTMLRenderer")

function handleRequest(directory) {
  const PageRenderer = new HTMLRenderer(directory)
  return (req, res, next) => {
    const path = url.parse(req.url).pathname
    if (req.accepts('text/html') || path.endsWith('.html')) {
      res.set('Content-Type', 'text/html').send(PageRenderer.render(path))
    } else if (path.endswith('.jsx')) {

    }
  }
}

module.exports = handleRequest
