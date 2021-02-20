function event(e, func) {window.addEventListener(e, func)}

function showId(x) {
  document.getElementById(x).style.display = ""
}

function showClass(x) {
  let elements = document.getElementsByClassName(x)
  for (i = 0; i < elements.length; i++) {
    elements[i].style.display = ""
  }
}

function hideId(x) {
  document.getElementById(x).style.display = "none"
}

function hideClass(x) {
  let elements = document.getElementsByClassName(x)
  for (i = 0; i < elements.length; i++) {
    elements[i].style.display = "none"
  }
}

function addClass(cl, id) {
  document.getElementById(id).classList.add(cl)
}

function removeClass(cl, id) {
  document.getElementById(id).classList.remove(cl)
}

function replaceClass(cl1, cl2, id) {
  document.getElementById(id).classList.remove(cl1)
  document.getElementById(id).classList.add(cl2)
}

function fillUiElements(className, value) {
  let elements = document.getElementsByClassName(className)
  for (element in elements) {
    elements[element].innerText = value
  }
}

const UI_REFRESH_STATS = allStats

function refreshStats() {
  for (stat in UI_REFRESH_STATS) {
    let className = UI_REFRESH_STATS[stat] + "-value"
    fillUiElements(className, user.stats.current[stat])
  }
  fillUiElements("role-value", user.currentRole)
  fillUiElements("level-value, user.roles[user.currentRole].level)
  fillUiElements("xp-value, user.roles[user.currentRole].xp)
}

function refreshUi() {
  refreshStats() 
}
