const PublicGradientService = require("../service/public-gradient.service");

const service = new PublicGradientService

const createPublicGradient = async (req, res, next) => {
  try {
    const { name } = req.body

    const newGradient = await service.create(name)
    res.status(201).json(newGradient)
  } catch (error) {
    next(error)
  }
}

const getPublicGradients = async (req, res, next) => {
  try {
    const gradients = await service.find()
    res.json(gradients)
  } catch (error) {
    next(error)
  }
}

const getPublicGradient = async (req, res, next) => {
  try {
    const { id } = req.params

    const gradient = await service.findOne(id)
    res.json(gradient)
  } catch (error) {
    next(error)
  }
}


module.exports = { createPublicGradient, getPublicGradients, getPublicGradient }