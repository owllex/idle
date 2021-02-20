const UI_REFRESH_STATS = allStats

function fillProgressBar(className, currentValue, maxValue) {
  let percent = currentValue / maxValue * 100
  let elements = document.getElementsByClassName(className)
  for (i = 0; i < elements.length; i++) {
    let element = elements[i]
    let textContainer = element.getElementsByClassname("progress-text")[0]
    textContainer.innerText = `${currentValue} / ${maxValue}`
    let progressBar = element.getElementsByClassName("progress")[0]
    progressBar.dataset.percent = percent
    progressBar.style.width = `${percent}%`
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
  
  fillProgressBar("hp-progress", user.vitals.hp, user.stats.current.maxHp)
  fillProgressBar("mp-progress", user.vitals.mp, user.stats.current.maxMp)
  fillProgressBar("st-progress", user.vitals.st, user.stats.current.maxSt)

  let currentXp = user.roles[user.currentRole].xp
  let nextXp = xpForRoleLevel(user.roles[user.currentRole].level + 1)
  fillProgressBar("xp-progress", currentXp, nextXp)
}

function refreshUi() {
  refreshStats() 
}
