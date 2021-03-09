const INITIATIVE_MULTIPLIER = 10
const BATTLE_UPDATE_RATE = 1
const DAMAGE_VARIANCE_PERCENT = 0.25
const BLOCK_DAMAGE_MULTIPLIER = 0.5
const CRIT_DAMAGE_MULTIPLIER = 2.0
const CRIT_DAMAGE_ROLL_MIN = 99 // Int, from 1-100

let battleTimer = null

function stopBattleTimer() {
  clearInterval(battleTimer)
  battleTimer = null
}

function getHeroAttackVerb() {
  // Based on equipped weapons. Until weapons are implemented, use a generic verb.
  return 'default'
}

function assignEnemyDamage(enemyId, damage, output) {
  let enemy = user.battle.enemies[enemyId]
  enemy.hp -= damage
  if (enemy.hp <= 0) {
    log(output, `${enemyId} is defeated!`)
  }
}

// Attack outcomes:
// Miss, Dodge / Resist, Parry, Glancing Hit (Block), Hit, Critical Hit.
// Armor applies damage reduction if a hit occurs.
function heroTurn(output) {
  // Select target. Right now, just the first living enemy.
  let target = null
  for (const [enemyId, data] of Object.entries(user.battle.enemies)) {
    if (data.hp > 0) {
      target = enemyId
      break
    }
  }
  if (!target) {
    console.log('No targets to attack!')
    return
  }
  let enemy = user.battle.enemies[target]
  
  // Hero rolls to attack.
  let attackRoll = roll(100)
  let attackValue = attackRoll + user.stats.current.attack
  
  // Enemy rolls to defend.
  let defenseRoll = roll(100)
  let defenseValue = defenseRoll + enemy.stats.defense
  if (attackValue < defenseValue) {
    // Missed.
    log(output, missText('hero', target))
    return
  }
  // Walk through additional defenses.
  let shift = attackValue - defenseValue
  if (shift < enemy.stats.dodge) {
    // Dodged, no damage.
    log(output, dodgeText('hero', target))
    return
  }
  shift -= enemy.stats.dodge
  if (shift < enemy.stats.parry) {
    // Parried, no damage.
    log(output, parryText('hero', target))    
    return
  }
  shift -= enemy.stats.parry
  
  // All following outcomes incur damage.
  let minDamage = Math.floor(user.stats.current.damage * (1 - DAMAGE_VARIANCE_PERCENT))
  let maxDamage = Math.floor(user.stats.current.damage * (1 + DAMAGE_VARIANCE_PERCENT))
  let damage = Math.max(1, random(minDamage, maxDamage) - enemy.stats.armor)

  if (shift < enemy.stats.block) {
    // Blocked, partial damage.
    damage *= BLOCK_DAMAGE_MULTIPLIER
    log(output, blockText('hero', target, damage, getHeroAttackVerb()))    
    assignEnemyDamage(target, damage, output)
    return
  }
  if (attackRoll >= CRIT_DAMAGE_ROLL_MIN) {
    // Critical hit.
    damage *= CRIT_DAMAGE_MULTIPLIER
    log(output, criticalHitText('hero', target, damage, getHeroAttackVerb()))    
    assignEnemyDamage(target, damage, output)
    return
  }
  // Regular hit.
  log(output, hitText('hero', target, damage, getHeroAttackVerb()))
  assignEnemyDamage(target, damage, output)
}

function enemyTurn(enemyId, output) {
  log(output, `${enemyId} Turn!`)
}

// // Executes the next turn of the battle.
// function nextTurn(output) {
//   // Figure out who is going next.
//   let bestSteps = (user.battle.maxInit - user.battle.heroInit) / user.stats.current.speed
//   let next = "hero"
//   for (const [enemyId, data] of Object.entries(user.battle.enemies)) {
//     let steps = (user.battle.maxInit - data.init) / data.stats.speed
//     if (steps < bestSteps) {
//       bestSteps = steps
//       next = enemyId
//     }
//   }
//   bestSteps = Math.ceil(bestSteps)
//   // If a combatant already has enough initiative to take a turn, don't advance
//   // anyone's initative. If multiple combatants are ready at the same time, ties are
//   // broken arbitrarily.
//   if (bestSteps > 0) {
//     // Advance all initiative trackers by the number of steps for the next to go.
//     user.battle.heroInit += (user.stats.current.speed * bestSteps)
//     for (const [enemyId, data] of Object.entries(user.battle.enemies)) {
//       data.init += (data.stats.speed * bestSteps)
//     }
//   }
  
//   console.log(`${next} turn`)
//   if (next == "hero") {
//     user.battle.heroInit -= user.battle.maxInit
//     heroTurn(output)
//   } else {
//     user.battle.enemies[next] -= user.battle.maxInit
//     enemyTurn(next, output)
//   }
// }

function tickBattle(output) {
  if (!user.battle.active) {
    stopBattleTimer()
    return
  }
  log(output, '.')
  user.battle.heroInit += user.stats.current.speed
  if (user.battle.heroInit >= user.battle.maxInit) {
    user.battle.heroInit -= user.battle.maxInit
    heroTurn(output)
  }
  for (const [enemyId, data] of Object.entries(user.battle.enemies)) {
    if (data.hp <= 0) {
      // Skip dead enemies.
      continue
    }
    data.init += data.stats.speed
    if (data.init > user.battle.maxInit) {
      data.init -= user.battle.maxInit
      enemyTurn(enemyId, output)
    }
  }
  // Check to see if the battle is over.
  if (user.vitals.hp <= 0) {
    endBattle()
    // TODO: hero death
    return
  }
  if (Object.values(user.battle.enemies).every((enemy) => {enemy.hp <= 0})) {
    endBattle()
    // TODO: victory
    return
  }
}

function startBattleTimer(output) {
  battleTimer = setInterval(() => {
    tickBattle(output)
  }, 1000 / BATTLE_UPDATE_RATE)
}

function startBattle(enemyId, output) {
  if (battleTimer) {
    console.log("Battle already in progress!")
    return
  } else if (user.battle.active) {
    // Battle in progress, but no timer is running.
    console.log("Restarting battle timer.")
    startBattleTimer(output)
    return
  }
  // Note: enemy IDs only permit one enemy of a type right now. Will need to change
  // that later.
  user.battle = {
    active: true,
    heroInit: 0,
    maxInit: 0,
    enemies: {
      [enemyId]: {stats: buildEnemyStatBlock(enemyId), init: 0, hp: 0},
    },
  }
  let bestEnemySpeed = 0;
  let enemyInitTable = {}
  for (const [enemyId, data] of Object.entries(user.battle.enemies)) {
    data.init = roll(INITIATIVE_MULTIPLIER * data.stats.speed)
    data.hp = data.stats.maxHp
    bestEnemySpeed = Math.max(bestEnemySpeed, data.stats.speed)
  }
  user.battle.maxInit = INITIATIVE_MULTIPLIER * Math.max(bestEnemySpeed, user.stats.current.speed)
  user.battle.heroInit = roll(INITIATIVE_MULTIPLIER * user.stats.current.speed)
  
  startBattleTimer(output)
}

function endBattle() {
  user.battle.active = false
  stopBattleTimer()
}

