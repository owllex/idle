function enterText(input, output) {
  let text = input.value
  input.value = ""
  if (!text) {
    return;
  }
  output.innerText += ("\n" + text)
  
  const words = text.split(' ')
  if (words.length == 0) {
    return
  }
  const commandTable = getCommandTable()
  if (!(words[0] in commandTable)) {
    invalidCommand(null, output)
  } else {
    commandTable(words.slice(1), output)
  }
  
}

function initTerminal() {
  buildCommandTable()
  
  input = document.getElementById("input");
  output = document.getElementById("output");
  
  input.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      enterText(input, output);
    }
  });
}
