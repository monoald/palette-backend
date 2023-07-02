const PaletteService = require('../service/palette.service')

const service = new PaletteService

const createPalette = async (req, res, next) => {
  try {
    const newPalette = await service.create(req.body)
    res.status(201).json(newPalette)
  } catch (error) {
    next(error)
  }
}

const getPalettes = async (req, res, next) => {
  try {
    const palettes = await service.find()
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
    const palette = await service.save(req.body)
    res.json(palette)
  } catch (error) {
    next(error)
  }
}

const unsavePalette = async (req, res, next) => {
  try {
    const palette = await service.unsave(req.body)
    res.json(palette)
  } catch (error) {
    next(error)
  }
}

module.exports = { createPalette, getPalettes, getPalette, savePalette, unsavePalette }
