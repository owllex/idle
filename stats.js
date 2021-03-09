// Everything in this list can be automatically combined.
const ALL_STATS = {
  // Strength: brute damage, physical skill prowess, HP (secondary)
  "str": {abbrev: "STR", name: "Strength"},
  
  // Vitality: HP (primary), SP (co-primary), resistance to physical effects
  "vit": {abbrev: "VIT", name: "Vitality"}, 
  
  // Dexterity: finesse damage, fine skill prowess
  "dex": {abbrev: "DEX", name: "Dexterity"},
  
  // Agility: Speed, evasion, SP (co-primary)
  "agi": {abbrev: "AGI", name: "Agility"},
  
  // Intelligence: arcane magic damage, MP (secondary)
  "int": {abbrev: "INT", name: "Intellect"},
  
  // Wisdom: nature magic damage, resistance to magical effects, MP (secondary)
  "wis": {abbrev: "WIS", name: "Wisdom"},
  
  // Magic: MP (primary), overall magic damage
  "mag": {abbrev: "MAG", name: "Magic"},
  
  // Charisma: interaction prowess, light/dark magic damage 
  "cha": {abbrev: "CHA", name: "Charisma"},
  
  // Max hit points
  "maxHp": {abbrev: "HP", name: "Hit Points"},
  
  // Max magic points 
  "maxMp": {abbrev: "MP", name: "Mana Points"},
  
  // Max stamina 
  "maxSt": {abbrev: "ST", name: "Stamina"},
  
  // Derived stats
  "speed": {abbrev: "SPD", name: "Speed"},
  "attack": {abbrev: "ATK", name: "Attack Raing"},
  "damage": {abbrev: "DMG", name: "Damage"},
  "dodge": {abbrev: "EVA", name: "Evasion"},
  "parry": {abbrev: "PAR", name: "Parry"},
  "block": {abbrev: "BLK", name: "Block"},
  "armor": {abbrev: "ARM", name: "Armor"},
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

function calculateVitals(stats) {
  return {
    maxHp: Math.floor(stats.maxHp + stats.vit * 2 + stats.str),
    maxMp: Math.floor(stats.maxMp + stats.mag * 2 + stats.int + stats.wis),
    maxSt: Math.floor(stats.maxSt + stats.vit + stats.agi),
  }
}

function calculateDerivedStats(stats) {
  // Attack and damage depend on equipped weapon. For now, base it on role.
  let attackType = ALL_ROLES[user.currentRole].attackType
  let attackStatValue = 0
  if (attackType == 'brute') {
    attackStatValue = stats.str
  } else if (attackType == 'finesse' || attackType == 'ranged') {
    attackStatValue = stats.dex
  }
  return {
    speed: Math.floor(stats.agi),
    attack: Math.floor(attackStatValue),
    damage: Math.floor(attackStatValue / 2), // Change to be based on weapon + attackStat
    dodge: 0,
    parry: 0,
    block: 0,
    armor: 0,
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
  newStats = addStatBlocks(newStats, derivedStats)
  user.stats.current = newStats

  let derivedVitals = calculateVitals(newStats)
  let hpDiff = derivedVitals.maxHp - user.vitals.maxHp
  let mpDiff = derivedVitals.maxMp - user.vitals.maxMp
  let stDiff = derivedVitals.maxSt - user.vitals.maxSt
  
  user.vitals.maxHp = derivedVitals.maxHp
  user.vitals.maxMp = derivedVitals.maxMp
  user.vitals.maxSt = derivedVitals.maxSt
  
  user.vitals.hp += hpDiff > 0 ? hpDiff : 0
  user.vitals.mp += mpDiff > 0 ? mpDiff : 0
  user.vitals.st += stDiff > 0 ? stDiff : 0
  
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
