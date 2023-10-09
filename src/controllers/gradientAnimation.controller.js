const GradientAnimationService = require("../service/gradientAnimation.service");

const service = new GradientAnimationService

const createGradientAnimation = async (req, res, next) => {
  try {
    const { name } = req.body
    const { userId } = req

    const newGradientAnimation = await service.create(name, userId)
    res.status(201).json(newGradientAnimation)
  } catch (error) {
    next(error)
  }
}

const getGradientAnimations = async (req, res, next) => {
  try {
    const gradientAnimations = await service.find()
    res.json(gradientAnimations)
  } catch (error) {
    next(error)
  }
}

const getGradientAnimation = async (req, res, next) => {
  try {
    const { id } = req.params

    const gradientAnimation = await service.findOne(id)
    res.json(gradientAnimation)
  } catch (error) {
    next(error)
  }
}

const saveGradientAnimation = async (req, res, next) => {
  try {
    const { name } = req.body
    const { userId } = req

    const gradientAnimation = await service.save(name, userId)
    res.json(gradientAnimation)
  } catch (error) {
    next(error)
  }
}

const unsaveGradientAnimation = async (req, res, next) => {
  try {
    const { name } = req.body
    const { userId } = req

    const gradientAnimation = await service.unsave(name, userId)
    res.json(gradientAnimation)
  } catch (error) {
    next(error)
  }
}

module.exports = { createGradientAnimation, getGradientAnimations, getGradientAnimation, saveGradientAnimation, unsaveGradientAnimation }