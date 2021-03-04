function logOutput(text, output) {
  output.innerText += ("\n" + text)
}

function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      }
    }
  };
}

function ambiguousCommand(commandList, output) {
  let result = "Which of the following did you mean? " + commandList.join(', ')
  logOutput(result, output)
}

function scoreCommand(args, output) {
  logOutput("<SCORE>", output)
}

const BASE_COMMANDS = {
  "score": scoreCommand,
  "sc": logOutput,
}

let commandTable = {}

function buildCommandTable() {
  let aliasTable = {}
  for (const [command, fn] of BASE_COMMANDS.entries()) {
    aliasTable[command] = [command]
  }
  
  for (const [command, fn] of BASE_COMMANDS.entries()) {
    for (i = 1; i < command.length; i++) {
      let subCommand = command.substring(0, i)
      if (subCommand in aliasTable) {
        // Collision
        aliasTable[subCommand].push(command)
      } else {
        aliasTable[subCommand] = [command]
      }
    }
  }
  
  for (const [command, commandList] of aliasTable.entries()) {
    if (commandList.length == 1) {
      // Single command
      commandTable[command] = BASE_COMMANDS[commandList[0]]
    } else {
      commandTable[command] = curry(ambiguousCommand(commandList))
    }
  }        
}

function getCommandTable() {
  return commandTable
}
