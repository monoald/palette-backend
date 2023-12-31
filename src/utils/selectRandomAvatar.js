const avatars = [
  'bear',
  'bee',
  'bull',
  'cat',
  'chicken',
  'frog',
  'gorilla',
  'hedgehog',
  'jaguar',
  'jellyfish',
  'lizard',
  'orangutan',
  'owl',
  'penguin',
  'pig',
  'polar-bear',
  'rabbit',
  'walrus',
  'wolf'
]

function selectRandomAvatar() {
  return avatars[(Math.floor(Math.random() * avatars.length))]
}

module.exports = { selectRandomAvatar }