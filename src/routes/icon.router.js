const { Router } = require('express')

const { createIcon, getIcons, getIcon, updateIcon, deleteIcon, downloadFonts, downloadIcons } = require('../controllers/icon.controller')
const { validatorHandler } = require('../middlewares/validator.handler')
const { iconSchema, getIconsPaginationSchema, getIconSchema, updateIconSchema, downloadFontSchema } = require('../schemas/icon.schema')
const { tokenDecoderHandler } = require('../middlewares/tokenDecoder.handler')

const router = Router()

router.get(
  '/download-fonts/:name',
  validatorHandler(downloadFontSchema, 'params'),
  downloadFonts
)

router.get(
  '/download-icons/:name',
  validatorHandler(downloadFontSchema, 'params'),
  downloadIcons
)

router.get('/',
  validatorHandler(getIconsPaginationSchema, 'query'),
  getIcons
)

router.get('/:id',
  validatorHandler(getIconSchema, 'params'),
  getIcon
)

router.post(
  '/',
  validatorHandler(iconSchema, 'body'),
  tokenDecoderHandler,
  createIcon
)

router.patch(
  '/:id',
  validatorHandler(updateIconSchema, 'body'),
  tokenDecoderHandler,
  updateIcon
)

router.delete(
  '/:id',
  validatorHandler(getIconSchema, 'params'),
  tokenDecoderHandler,
  deleteIcon
)

module.exports = router