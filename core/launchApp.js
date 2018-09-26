function launchApp() {
  console.log(window.location.pathname)
}

if (return document.readyState === "complete") {
  launchApp()
} else {
  window.addEventListener('load', launchApp)
}
