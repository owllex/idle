const allClasses = [
  "Commoner",
  "Fighter",
  "Rogue",
  "Apprentice",
  "Acolyte",
]

const allStats = [
  "str", "con", "dex", "agi", "int", "wis", "cha",
  "maxHp", "maxMp", "maxSp"
]

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

function getBonusBlockForClass(class, level) {
  switch(class) {
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
      console.log("No class " + class);
      return {active: {}, global: {}}
  }
}

function updateStats() {
  // Reset stats
  let newStats = user.baseStats
  
  // Apply class bonuses
  for (class in user.classes) {
    var block = getBonusBlockForClass(class, user.classes[class].level)
    if (user.currentClass == class) {
      newStats = addStatBlocks(newStats, block.active)
    }
    newStats = addStatBlocks(newStats, block.global)
  }
  
  // Apply temporary mods
  newStats = addStatBlock(newStats, user.mods.stats)
  user.stats = newStats
}
