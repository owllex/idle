const COLOR_WHITE = 'color-white'
const COLOR_RED = 'color-red'
const COLOR_BLUE = 'color-blue'
const COLOR_GREEN = 'color-green'
const COLOR_YELLOW = 'color-yellow'
const COLOR_MAGENTA = 'color-magenta'
const COLOR_CYAN = 'color-cyan'
const COLOR_GRAY = 'color-gray'

function wrapWithColor(htmlString, colorCode) {
  return `<span class=${colorCode}>${htmlString}</span>`
}

// Like string.padEnd, but doesn't count HTML against the length.
function smartPadEnd(str, targetLength, padString) {
  str.padEnd(targetLength, padString)
}

// Like string.padStart, but doesn't count HTML against the length.
function smartPadStart(str, targetLength, padString) {
  str.padStart(targetLength, padString)
}

const DEFAULT_PROGRESS_BAR_LENGTH = 22

// ▉▉▙
const LEFT_BAR_CHAR = '['
const RIGHT_BAR_CHAR = ']'
const FULL_BLOCK_CHAR = '█'
const HALF_BLOCK_CHAR = '▌'
const EMPTY_BLOCK_CHAR = ' '

class ProgressBar {
  constructor(value, max) {
    this.value = Math.max(Math.min(value, max), 0)
    this.max = max
    this.length = DEFAULT_PROGRESS_BAR_LENGTH
    this.label = ''
  }
  
  setLength(length) {
    this.length = Math.max(3, length)
    return this
  }
  
  showValue() {
    this.showValueSetting = true
    return this
  }
  
  showAsPercent() {
    this.showAsPercentSetting = true
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
    const frac = fractionalBlocks - blocks
    let empties = (this.length - 2) - blocks
    let midBlock = ''
    if (frac >= 0.5) {
      midBlock = HALF_BLOCK_CHAR
    } else if (frac > 0) {
      midBlock = EMPTY_BLOCK_CHAR
    }
    if (midBlock) {
      empties -= 1
    }
    let result = LEFT_BAR_CHAR + FULL_BLOCK_CHAR.repeat(blocks) +
        midBlock + EMPTY_BLOCK_CHAR.repeat(empties) + RIGHT_BAR_CHAR
    if (this.colorCode) {
      result = wrapWithColor(result, this.colorCode)
    }    
    if (this.label) {
      result = this.label + " " + result
    }
    if (this.showValueSetting) {
      if (this.showAsPercentSetting) {
        result += ` ${Math.floor(this.value / this.max * 100)}%`
      } else {
        result += ` ${formatNumber(this.value)} / ${formatNumber(this.max)}`
      }
    }
    return result
  }
}
