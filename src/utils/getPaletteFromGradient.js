function getPaletteFromGradient(gradient) {
  const urlParams = new URLSearchParams(gradient)
  const row1 = urlParams.get('r1')?.split('_')
  const row2 = urlParams.get('r2')?.split('_') || []
  let palette = ''

  row1.forEach((color, index) => {
    const obj = color.split('-')
    palette += obj[0]

    if (index !== row1.length - 1) palette += '-'
  })

  row2.forEach((color, index) => {
    const obj = color.split('-')
    palette += obj[0]

    if (index !== row1.length - 1) palette += '-'
  })

  return palette
}

module.exports = { getPaletteFromGradient }