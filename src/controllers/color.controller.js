const ColorService = require("../service/color.service");

const service = new ColorService

const createColor = async (req, res, next) => {
  try {
    const { name } = req.body
    const { userId } = req

    const newColor = await service.create(name, userId)
    res.status(201).json(newColor)
  } catch (error) {
    next(error)
  }
}

const getColors = async (req, res, next) => {
  try {
    const { page } = req.query

    const colors = await service.find(page)
    res.json(colors)
  } catch (error) {
    next(error)
  }
}

const getColor = async (req, res, next) => {
  try {
    const { id } = req.params

    const color = await service.findOne(id)
    res.json(color)
  } catch (error) {
    next(error)
  }
}

const saveColor = async (req, res, next) => {
  try {
    const { name } = req.body
    const { userId } = req

    const color = await service.save(name, userId)
    res.json(color)
  } catch (error) {
    next(error)
  }
}

const unsaveColor = async (req, res, next) => {
  try {
    const { name } = req.body
    const { userId } = req

    const color = await service.unsave(name, userId)
    res.json(color)
  } catch (error) {
    next(error)
  }
}

module.exports = { createColor, getColors, getColor, saveColor, unsaveColor }