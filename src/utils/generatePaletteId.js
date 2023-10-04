const crypto = require('crypto')

function generatePaletteId(palette) {
  const sortedPalette = palette.split('-').sort().join('-');
  const hash = crypto.createHash('sha256').update(sortedPalette).digest('hex');

  return hash;
}

module.exports = { generatePaletteId }