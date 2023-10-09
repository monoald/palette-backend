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
    const { page } = req.query

    const gradients = await service.find(page)
    res.json(gradients)
  } catch (error) {
    next(error)
  }
}


module.exports = { createPublicGradient, getPublicGradients }