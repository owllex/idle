function logWithClass(text, className, output) {
  let textNode = document.createTextNode(text)
  let preNode = document.createElement("PRE")
  preNode.classList.add(className)
  preNode.appendChild(textNode)
  output.appendChild(preNode)
}

function logHtml(html, className, output) {
  let preNode = document.createElement("PRE")
  preNode.innerHTML = html
  preNode.classList.add(className)
  output.appendChild(preNode)
}

function log(html, output) {
  logHtml(html, "output-content", output)
}

function logInput(text, output) {
  logWithClass("> " + text, "input-content", output)
}

function saveCommand(args, output) {
  saveGame()
  log("Game Saved!", output)
}

function invalidCommand(args, output) {
  log("No such command.", output)
}

function helpCommand(args, output) {
  let result = 'Try one of the following:\n' + Object.keys(BASE_COMMANDS).join(', ')
  log(result, output)
}

function ambiguousCommand(commandList, output) {
  let result = "Which of the following did you mean? " + commandList.join(', ')
  log(result, output)
}

function scoreCommand(args, output) {
  log("<SCORE>", output)
}

function vitalsCommand(args, output) {
  let result = ""
  result += new ProgressBar(user.vitals.hp, user.vitals.maxHp).setLabel("HP").setColor(COLOR_RED).showValue().format()
  result += "\n" + new ProgressBar(user.vitals.mp, user.vitals.maxMp).setLabel("MP").setColor(COLOR_BLUE).showValue().format()
  result += "\n" + new ProgressBar(user.vitals.st, user.vitals.maxSt).setLabel("ST").setColor(COLOR_YELLOW).showValue().format()
  log(result, output)
}

function experienceCommand(args, output) {
  let role = user.roles[user.currentRole]
  let result = ""
  result += "Level " + role.level + " " + user.currentRole + "\n"
  result += new ProgressBar(role.xp, xpForRoleLevel(role.level + 1)).setLabel("XP").setColor(COLOR_MAGENTA).showValue().format()
  log(result, output)
}

function inventoryCommand(args, output) {
  let result = "Inventory:\n"
  for (const [item, data] of Object.entries(user.inventory)) {
    if (data.quantity) {
      result += `  ${item} (${data.quantity})` + '\n'
    } else {
      result += `  ${item}` + '\n'
    }
  }
  log(result, output)
}

function resetGameCommand(args, output) {
  if (args && args[0] == "resetgame" && args[1] == "!") {
    resetGame()
    log("Game Reset!", output)
    return
  }
  let result = wrapWithColor(
    'Are you sure you want to completely reset the game? This cannot be undone!\n' +
    '  If so, type "resetgame !"', COLOR_RED)
  log(result, output)
}

const BASE_COMMANDS = {
  "experience": experienceCommand,
  "health": vitalsCommand,
  "help": helpCommand,
  "inventory": inventoryCommand,
  "resetgame": resetGameCommand,
  "save": saveCommand,
  "score": scoreCommand,
  "vitals": vitalsCommand,
  "xp": experienceCommand,
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
