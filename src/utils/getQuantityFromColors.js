function getQuantityFromColors(palette) {
  const colorsArr = palette.split('-')

  return colorsArr.length
}

module.exports = { getQuantityFromColors }