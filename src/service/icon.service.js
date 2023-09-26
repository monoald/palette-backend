const boom = require('@hapi/boom')

const Icon = require('../models/icon.model')
const User = require('../models/user.model')
const toSvgFont = require('./icons/toSvgFont')
const generateFonts = require('./icons/fonts/generateFonts')
const iconsToZip = require('./icons/fonts/iconsToZip')

class IconService {
  constructor() {}

  async create(data, userId) {
    const icon = await Icon.findOne({ name: data.name })

    if (icon) throw boom.conflict(`Collection name "${data.name}" already used.`)

    const user = await User.findById(userId)
      .select('icons')
      .populate('icons', {
        'name': 1,
        'icons': 1,
        'color': 1,
        '_id': 1
      })
    const { normalized: normalizedIcons, font } = await toSvgFont(data.icons, data.name, data.color)
    const fonts = await generateFonts(data, font)
    const iconsZip = await iconsToZip(normalizedIcons)

    const newIcon = new Icon({
      ...data,
      icons: normalizedIcons,
      svgFont: font,
      fonts,
      iconsZip,
      'users': [userId]
    })
    newIcon.save()

    user.icons.push(newIcon.id)
    user.save()

    return newIcon
  }

  async find(page) {
    const limit = 80
    const offset = (page - 1) * limit
    const icons = await Icon.find({})
      .limit(limit)
      .skip(offset)

    return icons
  }

  async findOne(id) {
    const icon = await Icon.findById(id)

    if (icon === null) {
      throw boom.notFound(`Icon not found.`)
    }

    return icon
  }

  async update(data, id) {
    if (data.icons) {
      const { normalized: normalizedIcons, font } = await toSvgFont(data.icons, data.name)
      const fonts = await generateFonts(data, font)

      data.icons = normalizedIcons
      data.svgFont = font
      data.fonts = fonts
    }

    const icon = await Icon.findOneAndUpdate(
      { _id: id },
      data,
      { new: true }
    )

    return icon
  }

  async delete(userId, id) {
    const icon = await Icon.findById(id)

    if (!icon) throw boom.conflict(`Icon does not exist.`)

    const user = await User.findById(userId)

    if (!user) throw boom.conflict(`User does not exist.`)
    const iconIndex = await user.icons.findIndex(icon => icon.toString() === id)

    if (iconIndex === -1) throw boom.conflict(`User has no icon ${icon.name}.`)

    await Icon.deleteOne({ _id: id })
    user.icons.splice(iconIndex, 1)
    user.save()

    return id
  }

  async downloadFonts(name) {
    const icon = await Icon.findOne({ name })

    if (!icon) throw boom.conflict(`Collection does not exist.`)

    return { name: icon.name, fonts: icon.fonts }
  }

  async downloadIcons(name) {
    const icon = await Icon.findOne({ name })

    if (!icon) throw boom.conflict(`Collection does not exist.`)

    return { name: icon.name, icons: icon.iconsZip }
  }
}

module.exports = IconService