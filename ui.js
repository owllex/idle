const UI_REFRESH_STATS = allStats

function fillProgressBar(className, currentValue, maxValue) {
  let percent = currentValue / maxValue
  let elements = document.getElementsByClassName(className)
  for (i = 0; i < elements.length; i++) {
    elements[i].style.width = "" + (percent * 100) + "%"
  }
}

function refreshStats() {
  for (stat in UI_REFRESH_STATS) {
    let statName = UI_REFRESH_STATS[stat]
    let className = statName + "-value"
    fillUiElements(className, user.stats.current[statName])
  }
  fillUiElements("role-value", user.currentRole)
  fillUiElements("level-value", user.roles[user.currentRole].level)
  
  let currentXp = user.roles[user.currentRole].xp
  let nextXp = xpForRoleLevel(user.roles[user.currentRole].level + 1)
  let xpProgressText = "" + currentXp + " / " + nextXp
  fillUiElements("xp-progress-value", xpProgressText)
  fillProgressBar("xp-progress", currentXp, nextXp)
}

function refreshUi() {
  refreshStats() 
}
