const { Router } = require('express')

const { createPalette, getPalettes, getPalette, savePalette, unsavePalette } = require('../controllers/palette.controller')
const { validatorHandler } = require('../middlewares/validator.handler')
const { paletteSchema, getPaletteSchema, getPalettesPaginationSchema } = require('../schemas/palette.schema')
const { tokenDecoderHandler } = require('../middlewares/tokenDecoder.handler')

const router = Router()

router.get('/',
  validatorHandler(getPalettesPaginationSchema, 'query'),
  getPalettes
)

router.get('/:id',
  validatorHandler(getPaletteSchema, 'params'),
  getPalette
)

router.post(
  '/',
  validatorHandler(paletteSchema, 'body'),
  tokenDecoderHandler,
  createPalette
)

router.post(
  '/save',
  validatorHandler(paletteSchema, 'body'),
  tokenDecoderHandler,
  savePalette
)

router.post(
  '/unsave',
  validatorHandler(paletteSchema, 'body'),
  tokenDecoderHandler,
  unsavePalette
)

module.exports = router