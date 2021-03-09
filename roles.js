const ALL_ROLES = {
  "Wanderer": {attackType: 'brute'},
  "Fighter": {attackType: 'brute'},
  "Ranger": {attackType: 'ranged'},
  "Rogue": {attackType: 'finesse'},
  "Apprentice": {attackType: 'brute'},
  "Acolyte": {attackType: 'brute'},
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
      return {active: {str: level - 1, vit: Math.floor(level / 2)}, global: {str: level - 1}}
    case "Ranger":
      return {active: {dex: level - 1, wis: Math.floor(level / 2)}, global: {dex: level - 1}}
    case "Apprentice":
      return {active: {int: level - 1, mag: Math.floor(level / 2)}, global: {int: level - 1}}
    case "Rogue":
      return {active: {dex: level - 1, agi: Math.floor(level / 2)}, global: {dex: level - 1}}
    case "Acolyte":
      return {active: {wis: level - 1, mag: Math.floor(level / 2)}, global: {wis: level - 1}}
    default:
      console.log("No role " + role);
      return {active: {}, global: {}}
  }
}

// Returns a list of all roles fuzzy-matching the given query.
function findRoleByName(query) {
  let possibleRoles = []
  for (const [role, data] of Object.entries(ALL_ROLES)) {
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
  user.currentRole = newRole
  updateStats()
  return true
}
  
function buildRolePrefixTable() {
  
}

function initRoles() {
  buildRolePrefixTable()
}
