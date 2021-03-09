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
  for (i = 0; i < elements.length; i++) {
    elements[i].innerText = value
  }
}

function logWithClass(output, text, className) {
  let textNode = document.createTextNode(text)
  let preNode = document.createElement("PRE")
  preNode.classList.add(className)
  preNode.appendChild(textNode)
  output.appendChild(preNode)
}

function logHtml(output, html, className) {
  let preNode = document.createElement("PRE")
  preNode.innerHTML = html
  preNode.classList.add(className)
  output.appendChild(preNode)
}

function log(output, html) {
  logHtml(output, html, "output-content")
}

function logInput(output, text) {
  logWithClass(output, "> " + text, "input-content")
}

function logPartial(output, html) {
  let node = output.lastElementChild
  if (node && node.classList.contains('partial')) {
    node.innerHTML = node.innerHTML + text
  } else {
    let preNode = document.createElement("PRE")
    preNode.innerHTML = html
    preNode.classList.add("output-content")
    preNode.classList.add("partial")
    output.appendChild(preNode)
  }
}
