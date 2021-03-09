const ALL_ATTACK_VERBS = {
  'swing': ['swing', 'swings'], 
  'stab': ['stab', 'stabs'],
  'fire': ['fire', 'fires'],
  'claw': ['claw', 'claws'],
  'bite': ['bite', 'bites'],
  'default': ['strike', 'strikes'],
}

function conjugate(subject, secondPerson, thirdPerson) {
  return subject == 'hero' ? secondPerson : thirdPerson
}

function conjugate(subject, conjugations) {
  return subject == 'hero' ? conjugations[0] : conjugations[1]
}

function attackVerb(subject, verb) {
  if (ALL_ATTACK_VERBS[verb]) {
    return conjugate(subject, ALL_ATTACK_VERBS[verb])
  }
  return conjugate(subject, ALL_ATTACK_VERBS['default'])
}

function num(number) {
  return Math.ceil(number.toString())
}

function num(number, color) {
  return color(Math.ceil(number.toString()), color)
}

function you(name, capitalize) {
  if (name == 'hero') {
    name = 'you'
  }
  if (capitalize) {
    return capitalize(name)
  }
  return name
}

function your(name) {
  if (name == 'hero') {
    name = 'your'
  } else {
    name += "'s"
  }
  if (capitalize) {
    return capitalize(name)
  }
  return name
}

function hitText(attacker, defender, damage, verb) {
  return `${you(attacker, true)} ${attackVerb(attacker, verb)} at ${you(defender)} for ${num(damage)} damage.`
}

function criticalHitText(attacker, defender, damage, verb) {
  return `${you(attacker, true)} ${attackVerb(attacker, verb)} at ${you(defender)} and scores a ${color('critical hit', COLOR_RED)} for ${num(damage, COLOR_YELLOW)} damage.`
}

function missText(attacker, defender, verb) {
  return `${you(attacker, true)} ${attackVerb(attacker, verb)} at ${you(defender)} but ${color(conjugate(attacker, 'miss', 'misses'), COLOR_GRAY)}.`
}

function dodgeText(attacker, defender) {
  return `${you(defender, true)} ${color(conjugate(defender, 'dodge', 'dodges'), COLOR_GRAY)} out of the way of ${your(attacker)} attack.`
}

function parryText(attacker, defender) {
  return `${you(defender, true)} ${color(conjugate(defender, 'parry', 'parries'), COLOR_GRAY)} ${your(attacker)} attack.`
}

function blockText(attacker, defender, damage, verb) {
  return `${you(attacker, true)} ${attackVerb(attacker, verb)} at ${you(defender)} and ${conjugate(attacker, 'strike', 'strikes')} a ${color('glancing blow', COLOR_GRAY)} for ${num(damage)} damage.`
}

