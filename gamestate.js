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

function saveGame(notify) {
  localStorage.setItem("user", JSON.stringify(user))
  if (notify) {
    successMessage("Game Saved")
  }
}

function resetGame(notify) {
  loadGame(newUser());
  if (notify) {
    successMessage("Game reset")
  }
}
