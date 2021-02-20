const UI_REFRESH_STATS = allStats

function refreshStats() {
  for (stat in UI_REFRESH_STATS) {
    let className = UI_REFRESH_STATS[stat] + "-value"
    fillUiElements(className, user.stats.current[stat])
  }
  fillUiElements("role-value", user.currentRole)
  fillUiElements("level-value", user.roles[user.currentRole].level)
  fillUiElements("xp-value", user.roles[user.currentRole].xp)
}

function refreshUi() {
  refreshStats() 
}
