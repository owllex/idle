function newUser() {
  return {
    version: "0.0.1",
    currentRole: "Commoner",
    baseStats: {
      str: 3, vit: 3, dex: 3, agi: 3, int: 3, wis: 3, cha: 3,
      maxHp: 10, maxMp: 10, maxSp: 10
    },
    stats: {
      str: 3, vit: 3, dex: 3, agi: 3, int: 3, wis: 3, cha: 3,
      maxHp: 10, maxMp: 10, maxSp: 10
    },
    mods: {
      stats: {}
    },
    roles: {
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

function loadGame(notify) {
  let data = JSON.parse(localStorage.getItem("user"))
  if (data != null) {
    user = data;
  }
  if (notify) {
    successMessage("Loaded version " + user.version)
  }
}
