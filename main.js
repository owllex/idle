console.log("loaded")

function event(e, func) {
  window.addEventListener(e, func)
}

function newUser() {
  return {
    version: "0.0.1",
    currentClass: "Commoner",
    classes: {
      "Commoner": {
        level: 1,
        xp: 0,
      }
    },
    time: {
      lastUpdate: Date.now(),
    }
  }
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
