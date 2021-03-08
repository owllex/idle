const INITIATIVE_MULTIPLIER = 10
const BATTLE_UPDATE_RATE = 1

let battleTimer = null

function stopBattleTimer() {
  clearInterval(battleTimer)
  battleTimer = null
}

// Attack outcomes:
// Dodge / Resist
// Parry
// Block
// Glancing Hit
// Hit
// Critical Hit*

// Calculate rating for each outcome and "stack" them.
// Armor applies damage reduction if a hit occurs.


function heroTurn(output) {
  log(output, "Hero Turn!")
}

function enemyTurn(enemyId, output) {
  log(output, `${enemyId} Turn!`)
}

// Executes the next turn of the battle.
function nextTurn() {
  // Figure out who is going next.
  let bestSteps = (user.battle.maxInit - user.battle.heroInit) / user.stats.current.speed
  let next = "hero"
  for (const [enemyId, data] of Object.entries(user.battle.enemies)) {
    let steps = (user.battle.maxInit - data.init) / data.stats.speed
    if (steps < bestSteps) {
      bestSteps = steps
      next = enemyId
    }
  }
  bestSteps = Math.ceil(bestSteps)
  // If a combatant already has enough initiative to take a turn, don't advance
  // anyone's initative. If multiple combatants are ready at the same time, ties are
  // broken arbitrarily.
  if (bestSteps > 0) {
    // Advance all initiative trackers by the number of steps for the next to go.
    user.battle.heroInit += (user.stats.current.speed * bestSteps)
    for (const [enemyId, data] of Object.entries(user.battle.enemies)) {
      data.init += (data.stats.speed * bestSteps)
    }
  }
  
  console.log(`${next} turn`)
  if (next == "hero") {
    user.battle.heroInit -= user.battle.maxInit
    heroTurn()
  } else {
    user.battle.enemies[next] -= user.battle.maxInit
    enemyTurn(next)
  }
}

function tickBattle(output) {
  if (!user.battle.active) {
    stopBattleTimer()
    return
  }
  user.battle.heroInit += user.stats.current.speed
  if (user.battle.heroInit >= user.battle.maxInit) {
    user.battle.heroInit -= user.battle.maxInit
    heroTurn()
  }
  for (const [enemyId, data] of Object.entries(user.battle.enemies)) {
    data.init += data.stats.speed
    if (data.init > user.battle.maxInit) {
      data.init -= user.battle.maxInit
      enemyTurn(enemyId)
    }
  }  
}

function startBattleTimer() {
  battleTimer = setInterval(() => {
    tickBattle()
  }, 1000 / BATTLE_UPDATE_RATE)
}

function startBattle(enemyId, output) {
  if (battleTimer) {
    console.log("Battle already in progress!")
    return
  } else if (user.battle.active) {
    // Battle in progress, but no timer is running.
    console.log("Restarting battle timer.")
    startBattleTimer()
    return
  }
  // Note: enemy IDs only permit one enemy of a type right now. Will need to change
  // that later.
  user.battle = {
    active: true,
    heroInit: 0,
    maxInit: 0,
    enemies: {
      [enemyId]: {stats: buildEnemyStatBlock(enemyId), init: 0},
    },
  }
  let bestEnemySpeed = 0;
  let enemyInitTable = {}
  for (const [enemyId, data] of Object.entries(user.battle.enemies)) {
    data.init = random(0, INITIATIVE_MULTIPLIER * data.stats.speed)
    bestEnemySpeed = Math.max(bestEnemySpeed, data.stats.speed)
  }
  user.battle.maxInit = INITIATIVE_MULTIPLIER * Math.max(bestEnemySpeed, user.stats.current.speed)
  user.battle.heroInit = random(0, INITIATIVE_MULTIPLIER * user.stats.current.speed)
  
  startBattleTimer()
}

function endBattle() {
  user.battle.active = false
  stopBattleTimer()
}

