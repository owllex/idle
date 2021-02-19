console.log("loaded")

function event(e, func) {
  window.addEventListener(e, func)
}

var user = newUser();

function progress() {
}

document.addEventListener("unload", () => {
  saveGame()
})

event("load", () => {
  setTimeout( () => {
    loadGame()
  }, 1)
})
