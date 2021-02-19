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
