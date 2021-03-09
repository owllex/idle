var PREFIXES = {
  '24': 'Y',
  '21': 'Z',
  '18': 'E',
  '15': 'P',
  '12': 'T',
  '9': 'G',
  '6': 'M',
  '3': 'k',
  '0': '',
  '-3': 'm',
  '-6': 'µ',
  '-9': 'n',
  '-12': 'p',
  '-15': 'f',
  '-18': 'a',
  '-21': 'z',
  '-24': 'y'
}

function getExponent(n) {
  if (n === 0) {
    return 0;
  }
  return Math.floor(Math.log10(Math.abs(n)));
}

function adjustPrecision(num) {
  return Number.parseFloat(num.toPrecision(3));
}

function formatNumber(num) {
  var n = adjustPrecision(Number.parseFloat(num));
  var e = Math.max(Math.min(3 * Math.floor(getExponent(n) / 3), 24), -24);
  return adjustPrecision(n / Math.pow(10, e)).toString() + PREFIXES[e];
}

// Returns a random number between low and high, inclusive.
function random(low, high) {
  return Math.floor((Math.random() * high) + low);
}

function random(high) {
  return random(1, high)
}
