const boom = require('@hapi/boom')

const GradientAnimation = require('../models/gradientAnimation.model')
const User = require('../models/user.model')
const { removeIdFromArray } = require('../utils/removeIdFromArray')

class GradientAnimationService {
  constructor() {}

  async create(name, userId) {
    const newGradientAnimation = await GradientAnimation.collection.insertOne({
      name,
      users: [userId],
      savedCount: 1
    })
      .catch(error => {
        if (error.code === 11000) {
          throw boom.conflict('Gradient animation already exists')
        }
      })

    const user = await User.findById(userId)
    user['gradient-animations'].push(newGradientAnimation.insertedId.toString())
    user.save()

    return { name }
  }

  async find() {
    const gradientsAnimations = await GradientAnimation.find()

    return gradientsAnimations
  }

  async findOne(id) {
    const gradientAnimation = await GradientAnimation.findById(id)

    if (gradientAnimation === null) {
      throw boom.notFound(`User not found.`)
    }

    return gradientAnimation
  }

  async save(name, userId) {
    const gradientAnimation = await GradientAnimation.findOne({ name })

    if (!gradientAnimation) {
      const newGradientAnimation = await this.create(name, userId)

      return newGradientAnimation
    }

    if (gradientAnimation.users.includes(userId)) {
      throw boom.conflict('Gradient animation already saved.')
    }

    gradientAnimation.users.push(userId)
    gradientAnimation.save()

    const user = await User.findById(userId)
    user['gradient-animations'].push(gradientAnimation.id)
    user.save()
    
    return gradientAnimation
  }

  async unsave(name, userId) {
    const gradientAnimation = await GradientAnimation.findOne({ name })
    const user = await User.findById(userId)

    if (!user['gradient-animations'].includes(gradientAnimation.id)) {
      throw boom.notImplemented('Gradient animation wasn\'t saved')
    }
    removeIdFromArray(gradientAnimation.id, user['gradient-animations'])
    removeIdFromArray(userId, gradientAnimation.users)
    user.save()
    gradientAnimation.save()

    return gradientAnimation
  }
}

module.exports = GradientAnimationService