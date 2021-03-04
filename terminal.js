commandStack = new Array()
commandIndex = -1

function pushCommand(command) {
  commandStack.push(command)
}

function setText(input, text) {
  input.value = text
  input.focus()
  input.setSelectionRange(input.value.length, input.value.length)
}

function enterText(input, output) {
  const text = input.value
  input.value = ""
  if (!text) {
    return;
  }
  logInput(text, output)
  pushCommand(text)
  
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
  
  logOutput("Welcome!", output)
  
  input.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      enterText(input, output);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (commandStack.length > commandIndex) {
        commandIndex += 1
        setText(input, commandStack[commandIndex]) 
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (commandIndex > 0) {
        commandIndex -= 1
        setText(input, commandStack[commandIndex]) 
      } else  {
        commandIndex = -1
        setText(input, "") 
      }
    }
  });
}
