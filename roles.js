const ALL_ROLES = {
  "Wanderer": {},
  "Fighter": {},
  "Rogue": {},
  "Apprentice": {},
  "Acolyte": {},
}

const STARTING_ROLE = "Wanderer"

const STARTING_ROLES_BLOCK = {
  "Wanderer": {level: 1, xp: 0},
}

function xpForRoleLevel(level) {
  return 68 + Math.pow(level, 5)
}

function getBonusBlockForRole(role, level) {
  switch (role) {
    case "Wanderer":
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
