const UI_REFRESH_STATS = allStats


function refreshStats() {
  for (stat in UI_REFRESH_STATS) {
    let statName = UI_REFRESH_STATS[stat]
    let className = statName + "-value"
    fillUiElements(className, user.stats.current[statName])
  }
  fillUiElements("role-value", user.currentRole)
  fillUiElements("level-value", user.roles[user.currentRole].level)
  
  let xpProgressText = "" + user.roles[user.currentRole].xp + " / " + xpForRoleLevel(user.roles[user.currentRole].level + 1)
  fillUiElements("xp-progress-value", xpProgressText)
}

function refreshUi() {
  refreshStats() 
}
