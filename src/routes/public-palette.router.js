const { Router } = require('express')

const { getPublicPalettes } = require('../controllers/public-palette.controller')
const { validatorHandler } = require('../middlewares/validator.handler')
const { getPalettesPaginationSchema } = require('../schemas/palette.schema')

const router = Router()

router.get('/',
  validatorHandler(getPalettesPaginationSchema, 'query'),
  getPublicPalettes
)


module.exports = router