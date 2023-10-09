const GradientService = require("../service/gradient.service");

const service = new GradientService

const createGradient = async (req, res, next) => {
  try {
    const { name } = req.body
    const { userId } = req

    const newGradient = await service.create(name, userId)
    res.status(201).json(newGradient)
  } catch (error) {
    next(error)
  }
}

const getGradients = async (req, res, next) => {
  try {
    const gradients = await service.find()
    res.json(gradients)
  } catch (error) {
    next(error)
  }
}

const getGradient = async (req, res, next) => {
  try {
    const { id } = req.params

    const gradient = await service.findOne(id)
    res.json(gradient)
  } catch (error) {
    next(error)
  }
}

const saveGradient = async (req, res, next) => {
  try {
    const { name } = req.body
    const { userId } = req

    const gradient = await service.save(name, userId)
    res.json(gradient)
  } catch (error) {
    next(error)
  }
}

const unsaveGradient = async (req, res, next) => {
  try {
    const { name } = req.body
    const { userId } = req

    const gradient = await service.unsave(name, userId)
    res.json(gradient)
  } catch (error) {
    next(error)
  }
}

module.exports = { createGradient, getGradients, getGradient, saveGradient, unsaveGradient }