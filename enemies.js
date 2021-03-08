const ALL_ENEMY_TAGS = {
  "weak": {stat: "maxHp", multi: 0.75},
  "sneaky": {stat: "dodge", multi: 1.25},
  "fast": {stat: "speed", multi: 1.5},
  "strong": {stat: "attack", multi: 1.5},
  "tough": {stat: "maxHp", multi: 1.5},
  "shield": {stat: "block", add: 10},
  "lightarmor": {stat: "armor", add: 3},
}

const ALL_ENEMIES = {
  "giantRat": {name: "Giant Rat", challenge: 1, tags: ["fast"], attackType: "brute"},
  "kobold": {name: "Kobold", challenge: 2, tags: ["fast", "sneaky", "lightarmor"], attackType: "brute"},
}

const DEFAULT_ENEMY = "kobold"

const BASE_ATTACK_VALUE = 2
const ATTACK_VARIANCE = 1.5 // Must be > 1.0
const CHALLENGE_SCALING = 1.5
const BASE_SPEED_VALUE = 10
const BASE_MAXHP_VALUE = 10
const BASE_DODGE_VALUE = 5

function applyTag(tag, block) {
  const tagData = ALL_ENEMY_TAGS[tag]
  if (!tagData || !tagData.stat || !tagData.multi) {
    return
  }
  if (tagData.stat == "attack") {
    if (tagData.add) {
      block["attackMin"] += tagData.add
      block["attackMax"] += tagData.add
    }
    if (tagData.multi) {
      block["attackMin"] *= tagData.multi
      block["attackMax"] *= tagData.multi
    }
  } else {
    if (tagData.add) {
      block[tagData.stat] += tagData.add
    }
    if (tagData.multi) {
      block[tagData.stat] *= tagData.multi
    }
  }  
}

function buildEnemyStatBlock(enemyId) {
  let enemy = ALL_ENEMIES[enemyId]
  if (!enemy) {
    console.log(`No enemy '${enemyId}'`)
    enemy = ALL_ENEMIES[DEFAULT_ENEMY]
  }
  const statMultiplier = Math.pow(enemy.challenge, CHALLENGE_SCALING)
  let block = {
    attack: Math.ceil(BASE_ATTACK_VALUE * statMultiplier),
    speed: Math.ceil(BASE_SPEED_VALUE * statMultiplier),
    maxHp: Math.ceil(BASE_MAXHP_VALUE * statMultiplier),
    dodge: Math.ceil(BASE_DODGE_VALUE * statMultiplier),
    parry: 0,
    block: 0,
    armor: 0,
  }
  for (const tag of enemy.tags) {
    applyTag(tag, block)
  }
  return block
}
