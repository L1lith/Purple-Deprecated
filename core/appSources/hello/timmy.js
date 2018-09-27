import ReactDOM from 'react-dom'
import createApp from '/Users/caleb/github/Purple/core/functions/createApp'
import element0 from "/Users/caleb/github/Purple/Purple-Project/pages/hello/*+.js"
const elements = [element0]
const app = createApp(elements, window.location.pathname, false)
const root = document.getElementById("root")
if (!root) throw new Error("Couldn't Find Application DOM Root")
ReactDOM.hydrate(app, root)
console.log("Application Launched")