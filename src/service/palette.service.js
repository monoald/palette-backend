const boom = require('@hapi/boom')

const Palette = require('../models/palette.model')
const User = require('../models/user.model')

const PublicPaletteService = require('./public-palette.service')

const { removeIdFromArray } = require('../utils/removeIdFromArray')
const { generatePaletteId } = require('../utils/generatePaletteId')

const service = new PublicPaletteService

class PaletteService {
  constructor() {}

  async create(colors, userId) {
    const palette = await Palette.findOne({ colors })

    if (palette) {
      throw boom.conflict('Palette already created.')
    }

    const upId = generatePaletteId(colors)
    const newPalette = new Palette({
      colors,
      upId,
      users: [userId]
    })
    await newPalette.save()

    const user = await User.findById(userId)
    user.palettes.push(newPalette.id)
    await user.save()

    await service.create(
      colors,
      userId,
      upId,
      newPalette.length
    )
      .catch(() => {})

    return newPalette
  }

  async find() {
    const palettes = await Palette.find({})

    return palettes
  }

  async findOne(id) {
    const palette = await Palette.findById(id)

    if (palette === null) {
      throw boom.notFound(`Palette not found.`)
    }

    return palette
  }

  async save(colors, userId) {
    const palette = await Palette.findOne({ colors })
    if (!palette) {
      const newPalette = await this.create(colors, userId)

      return newPalette
    }

    if (palette.users.includes(userId)) {
      throw boom.conflict('Palette already saved.')
    }

    palette.users.push(userId)
    await palette.save()

    const user = await User.findById(userId)
    user.palettes.push(palette.id)
    await user.save()

    await service.save(colors, userId, palette.upId, palette.length)
    
    return palette
  }

  async unsave(colors, userId) {
    const palette = await Palette.findOne({ colors })
    const user = await User.findById(userId)
    .populate('palettes', {
      'upId': 1,
      '_id': 1
    })

    if (user.palettes.findIndex(plt => palette.id === plt._id) !== -1) {
      throw boom.notImplemented('Palette wasn\'t in saved palettes')
    }

    removeIdFromArray(palette.id, user.palettes)
    removeIdFromArray(userId, palette.users)
    await user.save()
    await palette.save()

    let stillSamePalette = false

    user.palettes.forEach(plt => {
      if (palette.upId == plt.upId) {
        stillSamePalette = true
      }
    })
    
    if (!stillSamePalette) {
      await service.unsave(palette.upId, user._id)
    }

    return palette
  }
}

module.exports = PaletteService