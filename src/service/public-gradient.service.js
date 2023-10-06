const boom = require('@hapi/boom')

const PublicGradient = require('../models/public-gradient.model')

class PublicGradientService {
  constructor() {}

  
  async create(name, upId) {
    console.log('hola')
    await PublicGradient.collection.insertOne({
      name,
      upId
    })
      .catch(error => {
        if (error.code === 11000) {
          throw boom.conflict('Gradient with that colors already exists')
        }
      })

    return { name, upId: paletteId }
  }

  async find() {
    const gradients = await PublicGradient.find({})

    return gradients
  }

  async findOne(id) {
    const gradient = await PublicGradient.findById(id)

    if (gradient === null) {
      throw boom.notFound(`Gradient not found`)
    }

    return gradient
  }
}

module.exports = PublicGradientService