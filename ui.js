const UI_REFRESH_STATS = allStats

function refreshStats() {
  for (stat in UI_REFRESH_STATS) {
    let statName = UI_REFRESH_STATS[stat]
    let className = statName + "-value"
    fillUiElements(className, user.stats.current[statName])
  }
  fillUiElements("role-value", user.currentRole)
  fillUiElements("level-value", user.roles[user.currentRole].level)
  fillUiElements("xp-value", user.roles[user.currentRole].xp)
  fillUiElements("next-xp-value", xpForRoleLevel(user.roles[user.currentRole].level + 1))
}

function refreshUi() {
  refreshStats() 
}
