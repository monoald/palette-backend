const boom = require('@hapi/boom')

const Palette = require('../models/palette.model')
const User = require('../models/user.model')
const { removeIdFromArray } = require('../utils/removeIdFromArray')

class UserService {
  constructor() {}

  async create({ colors, userId }) {
    const palette = await Palette.findOne({ colors })

    if (palette) {
      throw boom.conflict(`Palette "${colors}" already created.`)
    }

    const newPalette = new Palette({
      'colors': colors,
      'users': [userId]
    })
    newPalette.save()
    
    const user = await User.findById(userId)
    user.palettes.push(newPalette.id)
    user.save()

    return newPalette
  }

  async find(page) {
    const limit = 2
    const offset = (page - 1) * limit
    const palettes = await Palette.find({})
      .sort({ savedCount: -1 })
      .limit(limit)
      .skip(offset)

    return palettes
  }

  async findOne(id) {
    const palette = await Palette.findById(id)

    if (palette === null) {
      throw boom.notFound(`Palette not found.`)
    }

    return palette
  }

  async save({colors, userId}) {
    const palette = await Palette.findOne({ colors })
    if (!palette) {
      const newPalette = await this.create({ colors, userId })

      return newPalette
    }

    if (palette.users.includes(userId)) {
      throw boom.conflict('Palette already saved.')
    }

    palette.users.push(userId)
    palette.save()

    const user = await User.findById(userId)
    user.palettes.push(palette.id)
    user.save()
    
    return palette
  }

  async unsave({id, userId}) {
    const palette = await this.findOne(id)
    const user = await User.findById(userId)

    if (!user.palettes.includes(id)) {
      throw boom.notImplemented('Palette wasn\'t in saved palettes')
    }

    removeIdFromArray(id, user.palettes)
    removeIdFromArray(userId, palette.users)
    user.save()
    palette.save()

    return palette
  }
}

module.exports = UserService