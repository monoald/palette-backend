const JSZip = require('jszip')

async function iconsToZip(icons) {
  const zip = new JSZip()

  icons.map(icon => {
    zip.file(`${icon.name}.svg`, icon.content)
  })

  let str = ''

  await zip.generateAsync({ type: 'base64', streamFiles: true })
    .then(zipStr => {
      str = zipStr
    })

  return str
}

module.exports = iconsToZip