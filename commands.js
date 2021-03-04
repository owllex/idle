function scoreCommand(args) {
  console.log("<SCORE>")
}

const BASE_COMMANDS = {
  "score": scoreCommand,
}

let commandTable = {...BASE_COMMANDS}

function buildCommandTable() {
}

function getCommandTable() {
  return commandTable
}
