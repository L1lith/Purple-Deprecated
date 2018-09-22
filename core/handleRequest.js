const url = require('url')
const Renderer = require("./Renderer")

function handleRequest(directory) {
  const renderer = new Renderer(directory)
  return async (req, res, next) => {
    const path = url.parse(req.url).pathname
    if (req.accepts('html') || path.endsWith('.html')) {
      const rawHTML = await renderer.renderHTML(path)
      if (rawHTML === null) return next()
      res.set('Content-Type', 'text/html').send(rawHTML)
    } else if (path.endswith('.jsp')) {
      const rawJS = await renderer.renderJS(path)
      if (rawJS === null) return next()
      res.set('Content-Type', 'application/json').send(rawJS)
    } else {
      console.log(path, req.accepts('html'))
    }
  }
}

module.exports = handleRequest
