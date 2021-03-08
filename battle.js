const INITIATIVE_MULTIPLIER = 10

// Attack outcomes:
// Dodge / Resist
// Parry
// Block
// Glancing Hit
// Hit
// Critical Hit*

// Calculate rating for each outcome and "stack" them.
// Armor applies damage reduction if a hit occurs.

function attack(attacker, defender) {
}

function nextTurn() {
}

function startBattle(enemyId) {
  if (user.activity.battle.active) {
    console.log("Battle already in progress!")
    return
  }
  user.activity.battle = {
    active: true,
    enemy: buildEnemyStatBlock(enemyId),
    initiative: {},
  }
  user.activity.battle.initiative = {
    initiativeMax: INITIATIVE_MULTIPLIER * Math.max(user.activity.battle.enemy.speed, user.stats.current.speed),
    heroInitiative: random(0, INITIATIVE_MULTIPLIER * user.stats.current.speed),
    enemyInitiative: random(0, INITIATIVE_MULTIPLIER * user.activity.battle.enemy.speed),
  }
}
