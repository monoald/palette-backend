const boom = require('@hapi/boom')

const PublicPalette = require('../models/public-palette.model')
const { removeIdFromArray } = require('../utils/removeIdFromArray')

class PublicPaletteService {
  constructor() {}

  async create(colors, userId, upId, length) {
    const palette = await PublicPalette.findOne({ upId })

    if (palette) {
      throw boom.conflict(`Palette whit that colors already exist.`)
    }

    const newPalette = new PublicPalette({
      colors,
      length,
      upId,
      users: [userId]
    })
    newPalette.save()

    return newPalette
  }

  async find(page) {
    const limit = 5
    const offset = (page - 1) * limit

    const palettes = await PublicPalette.find()
      .limit(limit)
      .skip(offset)

    return palettes
  }

  async save(colors, userId, upId, length) {
    const palette = await PublicPalette.findOne({ upId })

    if (!palette) {
      const newPalette = await this.create(colors, userId, upId, length)

      return newPalette
    }

    palette.users.push(userId)
    await palette.save()

    return palette
  }

  async unsave(upId, userId) {
    const palette = await PublicPalette.findOne({ upId })

    if (!palette) {
      throw boom.conflict(`Palette whit that colors does not exist.`)
    }

    removeIdFromArray(userId, palette.users)
    await palette.save()

    return { upId: palette.upId }
  }
}

module.exports = PublicPaletteService