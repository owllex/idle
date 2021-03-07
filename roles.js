const ALL_ROLES = {
  "Wanderer": {},
  "Fighter": {},
  "Rogue": {},
  "Apprentice": {},
  "Acolyte": {},
}

let rolePrefixTable = {}

const STARTING_ROLE = "Wanderer"

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

// Returns a list of all roles fuzzy-matching the given query.
function findRoleByName(query) {
  let possibleRoles = []
  for (const role in Object.keys(ALL_ROLES)) {
    if (role.toLowerCase().startsWith(query)) {
      possibleRoles.push(role)
    }
  }
  return possibleRoles
}

// Changes the user's role. Return true on success.
function changeRole(newRole) {
  if (!(newRole in ALL_ROLES) || !(newRole in user.roles)) {
    return false
  }
  user.currentRole = role
  updateStats()
  return true
}
  
function buildRolePrefixTable() {
  
}

function initRoles() {
  buildRolePrefixTable()
}
