const PaletteService = require('../service/palette.service')

const service = new PaletteService

const createPalette = async (req, res, next) => {
  try {
    const { colors } = req.body
    const { userId } = req

    const newPalette = await service.create(colors, userId)
    res.status(201).json(newPalette)
  } catch (error) {
    next(error)
  }
}

const getPalettes = async (req, res, next) => {
  try {
    const { page } = req.query

    const palettes = await service.find(page)
    res.json(palettes)
  } catch (error) {
    next(error)
  }
}

const getPalette = async (req, res, next) => {
  try {
    const { id } = req.params
    const palette = await service.findOne(id)
    res.json(palette)
  } catch(error) {
    next(error)
  }
}

const savePalette = async (req, res, next) => {
  try {
    const { colors } = req.body
    const { userId } = req

    const palette = await service.save(colors, userId)
    res.json(palette)
  } catch (error) {
    next(error)
  }
}

const unsavePalette = async (req, res, next) => {
  const { colors } = req.body
  const { userId } = req

  try {
    const palette = await service.unsave(colors, userId)
    res.json(palette)
  } catch (error) {
    next(error)
  }
}

module.exports = { createPalette, getPalettes, getPalette, savePalette, unsavePalette }
