function enterText(input, output) {
  const text = input.value
  input.value = ""
  if (!text) {
    return;
  }
  logInput(text, output)
  
  const words = text.split(' ')
  if (words.length == 0) {
    return
  }
  const commandTable = getCommandTable()
  const command = words[0]
  if (!(command in commandTable)) {
    invalidCommand(null, output)
  } else {
    commandTable[command](words.slice(1), output)
  }
  
}

function initTerminal() {
  buildCommandTable()
  
  input = document.getElementById("input");
  output = document.getElementById("output");
  
  logOutput("Welcome!")
  
  input.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      enterText(input, output);
    }
  });
}
