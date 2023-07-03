const { Router } = require('express')

const { createPalette, getPalettes, getPalette, savePalette, unsavePalette } = require('../controllers/palette.controller')
const { validatorHandler } = require('../middlewares/validator.handler')
const { paletteSchema, getPaletteSchema } = require('../schemas/palette.schema')
const { userExtractor } = require('../middlewares/userExtractor')

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
  userExtractor,
  createPalette
)

router.post(
  '/save',
  validatorHandler(paletteSchema, 'body'),
  userExtractor,
  savePalette
)

router.post(
  '/unsave',
  validatorHandler(getPaletteSchema, 'body'),
  userExtractor,
  unsavePalette
)

module.exports = router