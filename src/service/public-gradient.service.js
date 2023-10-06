const boom = require('@hapi/boom')

const PublicGradient = require('../models/public-gradient.model')
const { removeIdFromArray } = require('../utils/removeIdFromArray')

class PublicGradientService {
  constructor() {}

  async create(name, userId, upId) {
    await PublicGradient.collection.insertOne({
      name,
      upId,
      users: [userId]
    })
      .catch(error => {
        if (error.code === 11000) {
          throw boom.conflict('Gradient with that colors already exists')
        }
      })

    return { name, upId }
  }

  async find() {
    const gradients = await PublicGradient.find({})

    return gradients
  }

  async save(name, userId, upId) {
    const gradient = await PublicGradient.findOne({ upId })

    if (!gradient) {
      const newGradient = await this.create(name, userId, upId)

      return newGradient
    }

    gradient.users.push(userId)
    await gradient.save()

    return gradient
  }

  async unsave(upId, userId) {
    const gradient = await PublicGradient.findOne({ upId })

    if (!gradient) {
      throw boom.conflict(`Palette whit that colors does not exist.`)
    }

    removeIdFromArray(userId, gradient.users)
    await gradient.save()


    return { upId }
  }
}

module.exports = PublicGradientService