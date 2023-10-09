const PublicPaletteService = require('../service/public-palette.service')

const service = new PublicPaletteService

const getPublicPalettes = async (req, res, next) => {
  try {
    const { page } = req.query

    const palettes = await service.find(page)
    res.json(palettes)
  } catch (error) {
    next(error)
  }
}

module.exports = { getPublicPalettes }
