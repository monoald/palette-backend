const boom = require('@hapi/boom')

const Color = require('../models/color.model')
const User = require('../models/user.model')
const { removeIdFromArray } = require('../utils/removeIdFromArray')

class ColorService {
  constructor() {}

  async create(name, userId) {
    const newColor = await Color.collection.insertOne({
      name,
      users: [userId]
    })
      .catch(error => {
        if (error.code === 11000) {
          throw boom.conflict('Color already exists')
        }
      })

    const user = await User.findById(userId)
    user.colors.push(newColor.insertedId.toString())
    user.save()

    return { name }
  }

  async find(page) {
    const limit = 20
    const offset = (page - 1) * limit
    const colors = await Color.find({})
      .sort({ savedCount: -1 })
      .limit(limit)
      .skip(offset)

    return colors
  }

  async findOne(id) {
    const color = await Color.findById(id)

    if (color === null) {
      throw boom.notFound(`User not found.`)
    }

    return color
  }

  async save(name, userId) {
    const color = await Color.findOne({ name })
    console.log(color);

    if (!color) {
      const newColor = await this.create(name, userId)

      return newColor
    }

    if (color.users.includes(userId)) {
      throw boom.conflict('Color already saved.')
    }

    color.users.push(userId)
    color.save()

    const user = await User.findById(userId)
    user.colors.push(color.id)
    user.save()
    
    return color
  }

  async unsave(name, userId) {
    const color = await Color.findOne({ name })
    const user = await User.findById(userId)

    if (!user.colors.includes(color.id)) {
      throw boom.notImplemented('Color wasn\'t in saved colors')
    }

    removeIdFromArray(name.id, user.colors)
    removeIdFromArray(userId, color.users)
    user.save()
    color.save()

    return color
  }
}

module.exports = ColorService