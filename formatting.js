const COLOR_WHITE = 'white'
const COLOR_RED = 'red'
const COLOR_BLUE = 'blue'
const COLOR_GREEN = 'green'
const COLOR_YELLOW = 'yellow'
const COLOR_MAGENTA = 'magenta'
const COLOR_CYAN = 'cyan'

function wrapWithColor(htmlString, colorCode) {
  return `<span class=${colorCode}>${htmlString}</span>`
}

const DEFAULT_PROGRESS_BAR_LENGTH = 22

// ▉▉▙
const LEFT_BAR_CHAR = '['
const RIGHT_BAR_CHAR = ']'
const FULL_BLOCK_CHAR = '█'
const HALF_BLOCK_CHAR = '▄'
const EMPTY_BLOCK_CHAR = ' '

class ProgressBar {
  constructor(value, max) {
    this.value = value
    this.max = max
    this.length = DEFAULT_PROGRESS_BAR_LENGTH
    this.label = ''
  }
  
  setLength(length) {
    this.length = length
    return this
  }
  
  includeValue() {
    this.includeValue = true
    return this
  }
  
  showAsPercent() {
    this.showAsPercent = true
    return this
  }
  
  setLabel(label) {
    this.label = label
    return this
  }
  
  setColor(colorCode) {
    this.colorCode = colorCode
    return this
  }
  
  format() {
    const fractionalBlocks = this.value / this.max * (this.length - 2)
    const blocks = Math.floor(fractionalBlocks)
    const empties = (this.length - 2) - blocks
    const frac = fractionalBlocks - blocks
    let midBlock = EMPTY_BLOCK_CHAR
    if (frac >= 0.5) {
      midBlock = HALF_BLOCK_CHAR
    }
    let result = LEFT_BAR_CHAR + FULL_BLOCK_CHAR.repeat(blocks) +
        midBlock + EMPTY_BLOCK_CHAR.repeat(empties) + RIGHT_BAR_CHAR
    if (this.colorCode) {
      result = wrapWithColor(result, this.colorCode)
    }    
    if (this.label) {
      result = this.label + " " + result
    }
    if (this.includeValue) {
      if (this.showAsPercent) {
        result += ` ${Math.floor(this.value / this.max * 100)}%`
      } else {
        result += ` ${formatNumber(this.value)} / ${formatNumber(this.max)}`
      }
    }
    return result
  }
}
