function newUser() {
  return {
    version: "0.0.1",
    currentRole: STARTING_ROLE,
    vitals: getStartingVitals(),
    stats: {
      base: getStartingStatBlock(),
      current: getStartingStatBlock(),
    },
    inventory: {},
    roles: STARTING_ROLES_BLOCK,
    time: {
      lastUpdate: Date.now(),
    },
    activity: {
    },
    options: {
    },
  }
}

user = newUser()
updateStats()
recoverVitals()

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
    updateStats()
  }
  if (notify) {
    successMessage("Loaded version " + user.version)
  }
}

function resetGame(notify) {
  user = newUser()
  updateStats()
  recoverVitals()
  saveGame(false)
  if (notify) {
    successMessage("Game reset")
  }
}
