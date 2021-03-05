function newUser() {
  return {
    version: "0.0.1",
    currentRole: "Commoner",
    vitals: getStartingVitals(),
    stats: {
      base: getStartingStatBlock(),
      current: getStartingStatBlock(),
    },
    inventory: {
    },
    roles: {
      "Commoner": {
        level: 1,
        xp: 0,
      },
    },
    time: {
      lastUpdate: Date.now(),
    },
  }
}

user = newUser()

function saveGame(notify) {
  localStorage.setItem("user", JSON.stringify(user))
  if (notify) {
    successMessage("Game Saved")
  } else {
    console.log("Autosave")
  }
}

function loadGame(notify) {
  let data = JSON.parse(localStorage.getItem("user"))
  if (data != null) {
    user = data;
  }
  if (notify) {
    successMessage("Loaded version " + user.version)
  }
}

function resetGame(notify) {
  user = newUser()
  saveGame(false)
  if (notify) {
    successMessage("Game reset")
  }
}
