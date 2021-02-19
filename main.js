console.log("loaded")

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
