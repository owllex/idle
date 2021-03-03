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

function hookUpButtons() {
  document.getElementById("saveButton").addEventListener("click", () => saveGame(true))
  document.getElementById("resetButton").addEventListener("click", () => resetGame(true))
}

function hookUpTerminal() {
  let input = document.getElementById("input");
  let output = document.getElementById("output"); 
  
  input.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
      console.log(event.key)
      event.preventDefault();
      output.innerText += input.innerText
      input.innerText = ""
    }
  });
}

document.addEventListener("unload", () => {
  saveGame()
})

event("load", () => {
  setTimeout( () => {
    loadGame()
    hookUpButtons()
    hookUpTerminal()
    refreshUi()
    configureIntervals()
    console.log("Loaded")
  }, 1)
})
