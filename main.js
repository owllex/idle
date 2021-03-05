// How often to update the game state, in ticks/second.
const UPDATE_RATE = 4

function event(e, func) {
  window.addEventListener(e, func)
}

function tick() {
  console.log("tick")
  grantXp(1)
  refreshUi()
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
    initTerminal()
    refreshUi()
    configureIntervals()
    console.log("Loaded")
  }, 1)
})
