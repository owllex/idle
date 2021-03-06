const ALL_ROLES = [
  "Commoner",
  "Fighter",
  "Rogue",
  "Apprentice",
  "Acolyte",
]

function xpForRoleLevel(level) {
  return 68 + Math.pow(level, 5)
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
      return {active: {agi: level - 1}, global: {agi: level - 1}}
    case "Acolyte":
      return {active: {wis: level - 1}, global: {wis: level - 1}}
    default:
      console.log("No role " + role);
      return {active: {}, global: {}}
  }
}
