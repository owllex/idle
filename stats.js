const ALL_STATS = {
  // Strength: brute damage, physical skill prowess, HP (secondary)
  "str": {abbrev: "STR", name: "Strength"},
  // Vitality: HP (primary), SP (co-primary), resistance to physical effects
  "vit": {abbrev: "VIT", name: "Vitality"}, 
  // Dexterity: finesse damage, fine skill prowess
  "dex": {abbrev: "DEX", name: "Dexterity"},
  // Agility: Initiative, speed, evasion, SP (co-primary)
  "agi": {abbrev: "AGI", name: "Agility"},
  // Intelligence: arcane magic damage, MP (secondary)
  "int": {abbrev: "INT", name: "Intellect"},
  // Wisdom: nature magic damage, resistance to magical effects, MP (secondary)
  "wis": {abbrev: "WIS", name: "Wisdom"},
  // Magic: MP (primary), overall magic damage
  "mag": {abbrev: "MAG", name: "Magic"},
  // Charisma: interaction prowess, light/dark magic damage, MP (secondary)  
  "cha": {abbrev: "CHA", name: "Charisma"},
  // Max hit points
  "maxHp": {abbrev: "HP", name: "Hit Points"},
  // Max magic points 
  "maxMp": {abbrev: "MP", name: "Mana Points"},
  // Max stamina 
  "maxSt": {abbrev: "ST", name: "Stamina"},
}

function getStartingVitals() {
  return {
    hp: 1, mp: 1, st: 1,
    maxHp: 1, maxMp: 1, maxSt: 1,
  }
}

function getStartingStatBlock() {
  return {
    str: 3, vit: 3, dex: 3, agi: 3, int: 3, wis: 3, mag: 3, cha: 3,
    maxHp: 1, maxMp: 1, maxSt: 1,
  }
}

function addStatBlocks(left, right) {
  var result = left
  for (const stat of Object.keys(ALL_STATS)) {
    if (stat in right) {
      if (stat in result) {
        result[stat] += right[stat]
      } else {
        result[stat] = right[stat]
      }
    }
  }
  return result
}

function clamp(value, max) {
  return Math.max(Math.min(value, max), 0)
}

// Fixes vitals being out of range due to statistic adjustments.
function adjustVitals() {
  user.vitals.hp = clamp(user.vitals.hp, user.vitals.maxHp)
  user.vitals.mp = clamp(user.vitals.mp, user.vitals.maxMp)
  user.vitals.st = clamp(user.vitals.st, user.vitals.maxSt)
}

function recoverVitals() {
  user.vitals.hp = user.vitals.maxHp
  user.vitals.mp = user.vitals.maxMp
  user.vitals.st = user.vitals.maxSt
}

function calculateDerivedStats(stats) {
  return {
    maxHp: Math.floor(stats.maxHp + stats.vit * 2 + stats.str),
    maxMp: Math.floor(stats.maxMp + stats.mag + (stats.int + stats.wis + stats.cha) / 3),
    maxSt: Math.floor(stats.maxSt + stats.vit + stats.agi),
  }
}

function updateStats() {
  // Reset stats
  let newStats = {...user.stats.base}
  
  // Apply role bonuses
  for (role in user.roles) {
    var block = getBonusBlockForRole(role, user.roles[role].level)
    if (user.currentRole == role) {
      newStats = addStatBlocks(newStats, block.active)
    }
    newStats = addStatBlocks(newStats, block.global)
  }
  let derivedStats = calculateDerivedStats(newStats)

  user.stats.current = newStats
  user.vitals.maxHp = derivedStats.maxHp
  user.vitals.maxMp = derivedStats.maxMp
  user.vitals.maxSt = derivedStats.maxSt
  
  adjustVitals()
}

function grantXp(xp) {
  user.roles[user.currentRole].xp += xp
  while (true) {
    let currentXp = user.roles[user.currentRole].xp
    let xpForLevel = xpForRoleLevel(user.roles[user.currentRole].level + 1)
    if (currentXp >= xpForLevel) {
      // Level up
      user.roles[user.currentRole].level += 1
      user.roles[user.currentRole].xp -= xpForLevel
      updateStats()
      successMessage("Level up")
    } else {
      break;
    }
  }
}
