const boom = require('@hapi/boom')

const Gradient = require('../models/gradient.model')
const User = require('../models/user.model')

const PublicGradientService = require('../service/public-gradient.service')

const { removeIdFromArray } = require('../utils/removeIdFromArray')
const { getPaletteFromGradient } = require('../utils/getPaletteFromGradient')
const { generatePaletteId } = require('../utils/generatePaletteId')

const service = new PublicGradientService

class GradientService {
  constructor() {}

  async create(name, userId) {
    const palette = getPaletteFromGradient(name)
    const upId = generatePaletteId(name)
    await service.create(palette, upId)
      .catch((error) => {})

    const newGradient = await Gradient.collection.insertOne({
      name,
      users: [userId],
      savedCount: 1,
      upId
    })
      .catch(error => {
        if (error.code === 11000) {
          throw boom.conflict('Gradient already exists')
        }
      })

    const user = await User.findById(userId)
    user.gradients.push(newGradient.insertedId.toString())
    user.save()

    

    return { name }
  }

  async find(page) {
    const limit = 20
    const offset = (page - 1) * limit
    const gradients = await Gradient.find({})
      .limit(limit)
      .skip(offset)

    return gradients
  }

  async findOne(id) {
    const gradient = await Gradient.findById(id)

    if (gradient === null) {
      throw boom.notFound(`User not found.`)
    }

    return gradient
  }

  async save(name, userId) {
    const gradient = await Gradient.findOne({ name })

    if (!gradient) {
      const newGradient = await this.create(name, userId)

      return newGradient
    }

    if (gradient.users.includes(userId)) {
      throw boom.conflict('Gradient already saved.')
    }

    gradient.users.push(userId)
    gradient.save()

    const user = await User.findById(userId)
    user.gradients.push(gradient.id)
    user.save()
    
    return gradient
  }

  async unsave(name, userId) {
    const gradient = await Gradient.findOne({ name })
    const user = await User.findById(userId)

    if (!user.gradients.includes(gradient.id)) {
      throw boom.notImplemented('Gradient wasn\'t in saved gradients')
    }
    removeIdFromArray(gradient.id, user.gradients)
    removeIdFromArray(userId, gradient.users)
    user.save()
    gradient.save()

    return gradient
  }
}

module.exports = GradientService