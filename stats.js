const allRoles = [
  "Commoner",
  "Fighter",
  "Rogue",
  "Apprentice",
  "Acolyte",
]

const allStats = [
  "str", // Strength: brute damage, physical skill prowess, HP (secondary)
  "vit", // Vitality: HP (primary), SP (primary), resistance to physical effects
  "dex", // Dexterity: finesse damage, fine skill prowess
  "agi", // Agility: Initiative, speed, evasion, SP (secondary)
  "int", // Intelligence: arcane magic damage, MP (secondary)
  "wis", // Wisdom: nature magic damage, resistance to magical effects, MP (secondary)
  "mag", // Magic: MP (primary), overall magic damage
  "cha", // Charisma: interaction prowess, light/dark magic damage, MP (secondary)
  "maxHp", // Max hit points
  "maxMp", // Max magic points
  "maxSt" // Max stamina
]

function getStartingVitals() {
  return {
    hp: 10, mp: 10, st: 10
  }
}

function getStartingStatBlock() {
  return {
    str: 3, vit: 3, dex: 3, agi: 3, int: 3, wis: 3, mag: 3, cha: 3,
    maxHp: 10, maxMp: 10, maxSt: 10,
  }
}

function addStatBlocks(left, right) {
  var result = left
  for (i in allStats) {
    let stat = allStats[i]
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

function getBonusBlockForRole(role, level) {
  switch (role) {
    case "Commoner":
      return {active: {maxHp: level - 1}, global: {maxHp: level - 1}}
    case "Fighter":
      return {active: {str: level - 1}, global: {str: level - 1}}
    case "Apprentice":
      return {active: {int: level - 1}, global: {int: level - 1}}
    case "Rogue":
      return {active: {spd: level - 1}, global: {spd: level - 1}}
    case "Acolyte":
      return {active: {wis: level - 1}, global: {wis: level - 1}}
    default:
      console.log("No role " + role);
      return {active: {}, global: {}}
  }
}

function updateStats() {
  // Reset stats
  let newStats = user.stats.base
  
  // Apply role bonuses
  for (role in user.roles) {
    var block = getBonusBlockForRole(role, user.roles[role].level)
    if (user.currentRole == role) {
      newStats = addStatBlocks(newStats, block.active)
    }
    newStats = addStatBlocks(newStats, block.global)
  }

  user.stats.current = newStats
}
