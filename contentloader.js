function loadScript(url) {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  head.appendChild(script);
}

const deps = [
  "gamestate.js",
  "messages.js",
  "ui.js",
  "main.js",
]

for (dep in deps) {
  loadScript(dep);
}
