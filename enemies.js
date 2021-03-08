const ALL_ENEMIES = {
  "giantRat": {name: "Giant Rat", challenge: 1, attackType: "brute", primaryStats: {"agi"}},
  "kobold": {name: "Kobold", challenge: 1, attackType: "brute", primaryStats: {"str"}},
}

const DEFAULT_ENEMY = "kobold"

const BASE_ATTACK_VALUE = 2
const ATTACK_VARIANCE = 1.5 // Must be > 1.0
const CHALLENGE_SCALING = 1.5

function buildStatBlockForEnemy(enemy) {
  let enemy = ALL_ENEMIES[enemy]
  if (!enemy) {
    console.log(`No enemy '${enemy}'`)
    enemy = ALL_ENEMIES[DEFAULT_ENEMY]
  }
  const statMultiplier = Math.pow(enemy.challenge, CHALLENGE_SCALING)
  let attackMin = BASE_ATTACK_VALUE * statMultiplier
  let attackMax = BASE_ATTACK_VALUE * statMultiplier * ATTACK_VARIANCE
  return {
    attackMin: attackMin,
    attackMax: attackMax,
  }
}
