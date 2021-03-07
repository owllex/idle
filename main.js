// How often to update the game state, in ticks/second.
const UPDATE_RATE = 4

function event(e, func) {
  window.addEventListener(e, func)
}

function tick() {
  grantXp(1)
}

function configureIntervals() {
  // Game ticks.
  setInterval(() => {
    tick()
  }, 1000 / UPDATE_RATE)
  
  // Auto save.
  setInterval(() => {
    saveGame(false)
  }, 60000)
}

document.addEventListener("unload", () => {
  saveGame()
})

event("load", () => {
  setTimeout( () => {
    loadGame()
    initRoles()
    initCommands()
    initTerminal()
    configureIntervals()
    console.log("Loaded")
  }, 1)
})
