function logWithClass(text, className, output) {
  let textNode = document.createTextNode(text)
  let preNode = document.createElement("PRE")
  preNode.classList.add(className)
  preNode.appendChild(textNode)
  output.appendChild(preNode)
}

function logOutput(text, output) {
  logWithClass(text, "output-content", output)
}

function logInput(text, output) {
  logWithClass("> " + text, "input-content", output)
}

function saveCommand(args, output) {
  saveGame()
  logOutput("Game Saved!", output)
}

function invalidCommand(args, output) {
  logOutput("No such command.", output)
}

function helpCommand(args, output) {
  logOutput("This will be more helpful someday.", output)
}

function ambiguousCommand(commandList, output) {
  let result = "Which of the following did you mean? " + commandList.join(', ')
  logOutput(result, output)
}

function scoreCommand(args, output) {
  
  logOutput("<SCORE>", output)
}

function vitalsCommand(args, output) {
  let result = ""
  result += new ProgressBar(user.vitals.hp, user.vitals.maxHp).setLabel("HP").includeValue().format()
  result += "\n" + new ProgressBar(user.vitals.mp, user.vitals.maxMp).setLabel("MP").includeValue().format()
  result += "\n" + new ProgressBar(user.vitals.st, user.vitals.maxSt).setLabel("ST").includeValue().format()
  logOutput(result, output)
}

function experienceCommand(args, output) {
  let role = user.roles[user.currentRole]
  let result = ""
  result += "Level " + role.level + " " + user.currentRole + "\n"
  result += new ProgressBar(role.xp, xpForRoleLevel(role.level + 1)).setLabel("XP").includeValue().format()
  logOutput(result, output)
}

const BASE_COMMANDS = {
  "vitals": vitalsCommand,
  "health": vitalsCommand,
  "xp": experienceCommand,
  "experience": experienceCommand,
  "score": scoreCommand,
  "save": saveCommand,
  "help": helpCommand,
}

let commandTable = {}

function buildCommandTable() {
  let aliasTable = {}
  for (const [command, fn] of Object.entries(BASE_COMMANDS)) {
    aliasTable[command] = [command]
  }
  
  for (const [command, fn] of Object.entries(BASE_COMMANDS)) {
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
  
  for (const [command, commandList] of Object.entries(aliasTable)) {
    if (commandList.length == 1) {
      commandTable[command] = BASE_COMMANDS[commandList[0]]
    } else {
      commandTable[command] = (function(args, output) {
        ambiguousCommand(commandList, output)
      });
    }
  }        
}

function getCommandTable() {
  return commandTable
}
