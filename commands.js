function saveCommand(output, args) {
  saveGame()
  log(output, "Game Saved!")
}

function invalidCommand(output, args) {
  log(output, "No such command.")
}

function helpCommand(output, args) {
  let result = 'Try one of the following:\n' + Object.keys(BASE_COMMANDS).join(', ')
  log(output, result)
}

function ambiguousCommand(output, commandList) {
  let result = "Which of the following did you mean? " + commandList.join(', ')
  log(output, result)
}

function getVitals() {
  let lines = []
  lines.push(new ProgressBar(user.vitals.hp, user.vitals.maxHp).setLabel("HP").setColor(COLOR_RED).showValue().format())
  lines.push(new ProgressBar(user.vitals.mp, user.vitals.maxMp).setLabel("MP").setColor(COLOR_BLUE).showValue().format())
  lines.push(new ProgressBar(user.vitals.st, user.vitals.maxSt).setLabel("ST").setColor(COLOR_YELLOW).showValue().format())
  return lines
}

function getRoleAndXp() {
  let role = user.roles[user.currentRole]  
  let lines = []
  lines.push(`Level ${role.level} ${user.currentRole}`)
  lines.push(new ProgressBar(role.xp, xpForRoleLevel(role.level + 1)).setLabel("XP").setColor(COLOR_MAGENTA).showValue().format())
  return lines
}

const STATS_PADDING = 4

function statsCommand(output, args) {
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
  
  let lines = getRoleAndXp()
  lines.push(`STR ${str}   VIT ${vit}   DEX ${dex}   AGI ${agi}`)
  lines.push(`INT ${int}   WIS ${wis}   MAG ${mag}   CHA ${cha}`)
  
  lines = lines.concat(getVitals())
  
  log(output, lines.join('\n'))
}

function vitalsCommand(output, args) {
  log(output, getVitals().join('\n'))
}

function experienceCommand(output, args) {
  log(output, getRoleAndXp().join('\n'))
}

function inventoryCommand(output, args) {
  if (!user.inventory.length) {
    log(output, "Nothing in your inventory.")
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
  log(output, result)
}

function resetGameCommand(output, args) {
  if (args && args[0] == "resetgame" && args[1] == "!") {
    resetGame()
    log(output, "Game Reset!")
    return
  }
  let result = wrapWithColor(
    'Are you sure you want to completely reset the game? This cannot be undone!\n' +
    '  If so, type "resetgame !"', COLOR_RED)
  log(output, result)
}

function bonusBlockToString(block) {
  let statLines = []
  for (const [stat, data] of Object.entries(ALL_STATS)) {
    if (block[stat]) {
      const sign = block[stat] >= 0 ? '+' : '-'
      const numberText = wrapWithColor(`${sign}${block[stat]}`, COLOR_GRAY)
      statLines.push(`${data.abbrev} ${numberText}`)
    }
  }
  if (!statLines.length) {
    return wrapWithColor("Nothing", COLOR_GRAY)
  }
  return statLines.join(', ')
}

const ROLE_BOX_LENGTH = 38

// Generate a block of role data of uniform length ROLE_BOX_LENGTH without edge characters.
function buildRoleOutput(role, data) {
  let lines = []
  const bonusBlock = getBonusBlockForRole(role, data.level)
  if (user.currentRole == role) {
    lines.push(smartPadEnd(wrapWithColor(`${role}, Level ${data.level}`, COLOR_YELLOW), ROLE_BOX_LENGTH, ' '))
  } else {
    lines.push(smartPadEnd(`${role}, Level ${data.level}`, ROLE_BOX_LENGTH, ' '))
  }
  lines.push(smartPadEnd(`  Active bonus:  ${bonusBlockToString(bonusBlock.active)}`, ROLE_BOX_LENGTH, ' '))
  lines.push(smartPadEnd(`  Passive bonus: ${bonusBlockToString(bonusBlock.global)}`, ROLE_BOX_LENGTH, ' '))
  return lines
}

function rolesCommand(output, args) {
  let lines = []
  const validRoles = []
  for (const [role, data] of Object.entries(ALL_ROLES)) {
    if (user.roles[role]) {
      validRoles.push(role)
    }
  }
  validRoles.sort()
  let index = 0
  const lastIndex = validRoles.length - 1
  // Build output in pairs of roles.
  for (let i = 0; i < validRoles.length; i += 2) {
    let firstRoleOutput = buildRoleOutput(validRoles[i], user.roles[validRoles[i]])
    
    // Add pipes to each line.
    for (let j = 0; j < firstRoleOutput.length; j++) {
      const leftSide = i % 2 == 0 ? '║' : ''
      firstRoleOutput[j] = `${leftSide}${firstRoleOutput[j]}║`
    }

    if (i == 0) {
      // Prepend header line.
      let rightCorner = i >= lastIndex ? '╗' : '╦'
      firstRoleOutput.unshift(`╔${'═'.repeat(ROLE_BOX_LENGTH)}${rightCorner}`)
    }

    let secondRoleOutput = []
    if (i >= lastIndex) {
      // This row does not have a second item, which means it's the last row.
      // Append footer line.
      firstRoleOutput.push(`╚${'═'.repeat(ROLE_BOX_LENGTH)}╝`)
      
      // Copy all lines to output as-is.
      lines = lines.concat(firstRoleOutput)
    } else {
      // This row has a second item.
      secondRoleOutput = buildRoleOutput(validRoles[i+1], user.roles[validRoles[i+1]])

      // Add pipes to each line. Add an extra space since we're not adding a left-side character.
      for (let j = 0; j < secondRoleOutput.length; j++) {
        secondRoleOutput[j] = `${secondRoleOutput[j]} ║`
      }

      // Prepend header line.
      if (i == 0) {
        secondRoleOutput.unshift(`${'═'.repeat(ROLE_BOX_LENGTH + 1)}╗`)
      }
      
      // Add footers for both first and second blocks.
      if (i + 2 <= lastIndex) {
        // Another row below the left column.
        firstRoleOutput.push(`╠${'═'.repeat(ROLE_BOX_LENGTH)}╬`)
      } else {
        firstRoleOutput.push(`╚${'═'.repeat(ROLE_BOX_LENGTH)}╩`)
      }
      if (i + 3 <= lastIndex) {
        // Another row below the right column.
        secondRoleOutput.push(`${'═'.repeat(ROLE_BOX_LENGTH + 1)}╣`)
      } else {
        secondRoleOutput.push(`${'═'.repeat(ROLE_BOX_LENGTH + 1)}╝`)
      }
      // Merge alternating lines.
      for (let j = 0; j < firstRoleOutput.length; j++) {
        lines.push(firstRoleOutput[j] + secondRoleOutput[j])
      }
    }  
  }
  log(output, lines.join('\n'))
}

function clearCommand(output, args) {
  output.innerHTML = ""
}

function reloadCommand(output, args) {
  saveGame()
  location.reload()
}

function changeCommand(output, args) {
  if (args[1] != "role" || !args[2]) {
    log(output, "Format is: change role [role-name]")
    return
  }
  const roleQuery = args.slice(2).join(" ")
  let possibleRoles = findRoleByName(roleQuery)
  if (possibleRoles.length == 0) {
    log(output, `There were no roles matching that name.`)
    return
  }
  if (possibleRoles.length > 1) {
    log(output, `There were multiple matching roles. Which did you mean?: ${possibleRoles.join(', ')}`)
    return
  }
  if (!changeRole(possibleRoles[0])) {
    log(output, 'Something went wrong.')
    return
  }

  log(output, `You've switched roles to ${user.currentRole} (Level ${user.roles[user.currentRole].level}).`)
}

const BASE_COMMANDS = {
  "change": changeCommand,
  "clear": clearCommand,
  "experience": experienceCommand,
  "health": vitalsCommand,
  "help": helpCommand,
  "inventory": inventoryCommand,
  "reload": reloadCommand,
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
    for (let i = 1; i < command.length; i++) {
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
      commandTable[command] = (function(output, args) {
        ambiguousCommand(output, commandList)
      });
    }
  }        
}

function initCommands() {
  buildCommandTable()
}

// Requires buildCommandTable() to be called first.
function runCommand(output, words) {
  const command = words[0]
  if (!(command in commandTable)) {
    invalidCommand(output)
  } else {
    commandTable[command](output, words)
  }
}
