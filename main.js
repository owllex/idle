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
  
  input.addEventListener("keypress", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
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
    refreshUi()
    configureIntervals()
    console.log("Loaded")
  }, 1)
})
