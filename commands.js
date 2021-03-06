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

const STATS_PADDING = 4

function statsCommand(args, output) {
  let role = user.roles[user.currentRole]
  const stats = user.stats.current
  let str = wrapWithColor(`${stats.str}`.padStart(STATS_PADDING), COLOR_GRAY)
  let vit = wrapWithColor(`${stats.vit}`.padStart(STATS_PADDING), COLOR_GRAY)
  let dex = wrapWithColor(`${stats.dex}`.padStart(STATS_PADDING), COLOR_GRAY)
  let agi = wrapWithColor(`${stats.agi}`.padStart(STATS_PADDING), COLOR_GRAY)
  let int = wrapWithColor(`${stats.int}`.padStart(STATS_PADDING), COLOR_GRAY)
  let wis = wrapWithColor(`${stats.wis}`.padStart(STATS_PADDING), COLOR_GRAY)
  let mag = wrapWithColor(`${stats.mag}`.padStart(STATS_PADDING), COLOR_GRAY)
  let cha = wrapWithColor(`${stats.cha}`.padStart(STATS_PADDING), COLOR_GRAY)
  
  const progressBar = new ProgressBar(role.xp, xpForRoleLevel(role.level + 1)).setLabel("XP").setColor(COLOR_MAGENTA).showValue().format()
  let result = `Level ${role.level} ${user.currentRole}` + '\n' + progressBar + '\n'
  result += `STR ${str}   VIT ${vit}   DEX ${dex}   AGI ${agi}` + '\n' +
            `INT ${int}   WIS ${wis}   MAG ${mag}   CHA ${cha}`
  
  log(result, output)
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
  result += `Level ${role.level} ${user.currentRole}` + "\n"
  result += new ProgressBar(role.xp, xpForRoleLevel(role.level + 1)).setLabel("XP").setColor(COLOR_MAGENTA).showValue().format()
  log(result, output)
}

function inventoryCommand(args, output) {
  if (!user.inventory.length) {
    log("Nothing in your inventory.", output)
    return
  }
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

const ROLE_BOX_LENGTH = 38

function bonusBlockToString(block) {
  let statLines = []
  for (const [stat, data] of Object.entries(ALL_STATS)) {
    if (block[stat]) {
      const sign = block[stat] >= 0 ? '+' : '-'
      const numberText = wrapWithColor(`${sign}${block[stat]}`, COLOR_GRAY)
      statLines.push(`${data.abbrev} ${numberText}`)
    }
  }
  return statLines.join(', ')
}

function rolesCommand(args, output) {
  let lines = []
  let index = 0
  const lastIndex = ALL_ROLES.length - 1
  for (const [role, data] of Object.entries(ALL_ROLES)) {
    const bonusBlock = getBonusBlockForRole(role, data.level)
    if (index == 0) {
      let rightCorner = index == lastIndex ? '╗' : '╦'
      if (index != lastIndex)
      lines.push(`╔${'═'.repeat(ROLE_BOX_LENGTH - 2)}${rightCorner}`)
    } else if (index == 1) {
      lines.push(`${'═'.repeat(ROLE_BOX_LENGTH - 1)}╗`)
    }
    lines.push(`║${role}, Level ${data.level}`.padRight(ROLE_BOX_LENGTH - 1, ' ') + '║')
    lines.push(`║  Active bonus: ${bonusBlockToString(bonusBlock.active)}`.padRight(ROLE_BOX_LENGTH - 1, ' ') + '║')
    lines.push(`║  Global bonus: ${bonusBlockToString(bonusBlock.global)}`.padRight(ROLE_BOX_LENGTH - 1, ' ') + '║')
    if (index == lastIndex && index % 2 == 0) {
      lines.push(`╚${'═'.repeat(ROLE_BOX_LENGTH - 2)}╝`)
    } else if ((index == lastIndex || index == lastIndex - 1) && index % 2 != 0) {
      lines.push(`${'═'.repeat(ROLE_BOX_LENGTH - 1)}╝`)
    } else if (index == lastIndex - 1 && index % 2 == 0) {
      lines.push(`╚${'═'.repeat(ROLE_BOX_LENGTH - 2)}╩`)
    } else if (index % 2 == 0) {
      lines.push(`╠${'═'.repeat(ROLE_BOX_LENGTH - 2)}╬`)
    } else {
      lines.push(`${'═'.repeat(ROLE_BOX_LENGTH - 1)}╣`)
    }
    index++
  }
  log(lines.join('\n'), output)
}

function clearCommand(args, output) {
  output.innerHTML = ""
}

const BASE_COMMANDS = {
  "clear": clearCommand,
  "experience": experienceCommand,
  "health": vitalsCommand,
  "help": helpCommand,
  "inventory": inventoryCommand,
  "resetgame": resetGameCommand,
  "roles": rolesCommand,
  "save": saveCommand,
  "stats": statsCommand,
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
