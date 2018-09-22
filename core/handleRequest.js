const url = require('url')
const Renderer = require("./Renderer")

function handleRequest(directory) {
  const renderer = new Renderer(directory)
  return (req, res, next) => {
    const path = url.parse(req.url).pathname
    if (req.accepts('text/html') || path.endsWith('.html')) {
      res.set('Content-Type', 'text/html').send(renderer.renderHTML(path))
    } else if (path.endswith('.jsp')) {
      res.set('Content-Type', 'application/json').send(renderer.renderJS(path))
    }
  }
}

module.exports = handleRequest
