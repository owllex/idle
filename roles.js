function xpForRoleLevel(level) {
  return 68 + Math.pow(level, 5)
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
