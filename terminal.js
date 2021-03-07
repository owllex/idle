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
  logInput(output, text)
  pushCommand(text)
  
  const words = text.split(' ')
  if (words.length == 0) {
    return
  }
  runCommand(output, words)
  input.scrollIntoViewIfNeeded()
}

function handleKeyEvent(event, input, output) {
  if (event.isComposing || event.keyCode === 229) {
    return
  } else if (event.key === 'Enter') {
    event.preventDefault();
    enterText(input, output);
    commandIndex = -1
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    if (commandIndex + 1 < commandStack.length) {
      commandIndex += 1
      setText(input, commandStack[commandStack.length - 1 - commandIndex])
    }
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (commandIndex > 0) {
      commandIndex -= 1
      setText(input, commandStack[commandStack.length - 1 - commandIndex])
    } else  {
      commandIndex = -1
      setText(input, "") 
    }
  }
}

function initTerminal() {
  input = document.getElementById("input");
  output = document.getElementById("output");
  
  log(output, "Welcome!")
  
  input.addEventListener("keydown", function (event) {
    handleKeyEvent(event, input, output);
  });
}
