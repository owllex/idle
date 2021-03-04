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

function formatProgressBar(value, max, length, label, includeValues, showAsPercent) {
  const fractionalBlocks = value / max * (length - 2)
  const blocks = Math.floor(fractionalBlocks)
  const empties = (length - 2) - blocks
  const frac = fractionalBlocks - blocks
  let midBlock = " "
  if (frac >= 0.66) {
    midBlock = "/"
  } else if (frac >= 0.33) {
    midBlock = "-"
  }
  let result = label + " [" + "|".repeat(blocks) + midBlock + " ".repeat(empties) + "]"
  if (includeValues) {
    if (showAsPercent) {
      result += " " + Math.floor((value / max * 100)) + "%"
    } else {
      result += " " + value + " / " + max
    }
  }
  return result
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
  const DEFAULT_PROGRESS_BAR_LENGTH = 22
  let result = ""
  result += formatProgressBar(user.vitals.hp, user.vitals.maxHp, DEFAULT_PROGRESS_BAR_LENGTH, "HP", true)
  result += "\n" + formatProgressBar(user.vitals.mp, user.vitals.maxMp, DEFAULT_PROGRESS_BAR_LENGTH, "MP", true)
  result += "\n" + formatProgressBar(user.vitals.st, user.vitals.maxSt, DEFAULT_PROGRESS_BAR_LENGTH, "ST", true)
  logOutput(result, output)
}

const BASE_COMMANDS = {
  "vitals": vitalsCommand,
  "health": vitalsCommand,
  "score": scoreCommand,
  "sc": logOutput,
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
