const { Router } = require("express");

const { validatorHandler } = require("../middlewares/validator.handler");
const { colorSchema, getColorSchema, getColorsPaginationSchema } = require("../schemas/color.schema");
const { tokenDecoderHandler } = require("../middlewares/tokenDecoder.handler");
const { createColor, getColors, getColor, saveColor, unsaveColor } = require("../controllers/color.controller");

const router = Router()

router.get(
  '/',
  validatorHandler(getColorsPaginationSchema, 'query'),
  getColors
)

router.get(
  '/:id',
  validatorHandler(getColorSchema, 'params'),
  getColor
)

router.post(
  '/',
  validatorHandler(colorSchema, 'body'),
  tokenDecoderHandler,
  createColor
)

router.post(
  '/save',
  validatorHandler(colorSchema, 'body'),
  tokenDecoderHandler,
  saveColor
)

router.post(
  '/unsave',
  validatorHandler(colorSchema, 'body'),
  tokenDecoderHandler,
  unsaveColor
)

module.exports = router