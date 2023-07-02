const { Router } = require('express')

const { createPalette, getPalettes, getPalette, savePalette, unsavePalette } = require('../controllers/palette.controller')
const { validatorHandler } = require('../middlewares/validator.handler')
const { paletteSchema, getPaletteSchema, savePaletteSchema, unsavePaletteSchema } = require('../schemas/palette.schema')

const router = Router()

router.get('/',
  getPalettes
)

router.get('/:id',
  validatorHandler(getPaletteSchema, 'params'),
  getPalette
)

router.post(
  '/',
  validatorHandler(paletteSchema, 'body'),
  createPalette
)

router.post(
  '/save',
  validatorHandler(paletteSchema, 'body'),
  savePalette
)

router.post(
  '/unsave',
  validatorHandler(unsavePaletteSchema, 'body'),
  unsavePalette
)

module.exports = router