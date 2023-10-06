const PublicPaletteService = require('../service/public-palette.service')

const service = new PublicPaletteService

const getPublicPalettes = async (req, res, next) => {
  try {
    const palettes = await service.find()
    res.json(palettes)
  } catch (error) {
    next(error)
  }
}

module.exports = { getPublicPalettes }
