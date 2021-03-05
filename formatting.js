const DEFAULT_PROGRESS_BAR_LENGTH = 22

// ▉▉▙
const LEFT_BAR_CHAR = '['
const RIGHT_BAR_CHAR = ']'
const FULL_BLOCK_CHAR = '█'
const HALF_BLOCK_CHAR = '▄'
const EMPTY_BLOCK_CHAR = ' '

function formatProgressBar(value, max, length, label, includeValues, showAsPercent) {
  const fractionalBlocks = value / max * (length - 2)
  const blocks = Math.floor(fractionalBlocks)
  const empties = (length - 2) - blocks
  const frac = fractionalBlocks - blocks
  let midBlock = EMPTY_BLOCK_CHAR
  if (frac >= 0.5) {
    midBlock = HALF_BLOCK_CHAR
  }
  let result = label + " " + LEFT_BAR_CHAR + FULL_BLOCK_CHAR.repeat(blocks) +
      midBlock + EMPTY_BLOCK_CHAR.repeat(empties) + RIGHT_BAR_CHAR
  if (includeValues) {
    if (showAsPercent) {
      result += " " + Math.floor((value / max * 100)) + "%"
    } else {
      result += " " + formatNumber(value) + " / " + formatNumber(max)
    }
  }
  return result
}

function formatDefaultProgressBar(value, max, label, includeValue, showAsPercent) {
  return formatDefaultProgressBar(value, max, DEFAULT_PROGRESS_BAR_LENGTH, label, includeValue, showAsPercent)
}
