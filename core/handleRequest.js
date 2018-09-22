const url = require('url')
const Renderer = require("./Renderer")

function handleRequest(directory) {
  const renderer = new Renderer(directory)
  return (req, res, next) => {
    const path = url.parse(req.url).pathname
    if (req.accepts('text/html') || path.endsWith('.html')) {
      const rawHTML = renderer.renderHTML(path)
      if (rawHTML === null) return next()
      res.set('Content-Type', 'text/html').send(rawHTML)
    } else if (path.endswith('.jsp')) {
      const rawJS = renderer.renderJS(path)
      if (rawJS === null) return next()
      res.set('Content-Type', 'application/json').send(rawJS)
    }
  }
}

module.exports = handleRequest
