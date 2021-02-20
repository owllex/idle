function xpForRoleLevel(level) {
  return 68 + Math.pow(level, 5)
}

function grantXp(xp) {
  user.roles[user.currentRole].xp += xp
}
