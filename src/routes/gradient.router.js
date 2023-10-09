const { Router } = require("express");

const { validatorHandler } = require("../middlewares/validator.handler");
const { gradientSchema, getGradientSchema } = require("../schemas/gradient.schema");
const { tokenDecoderHandler } = require("../middlewares/tokenDecoder.handler");
const { createGradient, getGradients, getGradient, saveGradient, unsaveGradient } = require("../controllers/gradient.controller");

const router = Router()

router.get(
  '/',
  getGradients
)

router.get(
  '/:id',
  validatorHandler(getGradientSchema, 'params'),
  getGradient
)

router.post(
  '/',
  validatorHandler(gradientSchema, 'body'),
  tokenDecoderHandler,
  createGradient
)

router.post(
  '/save',
  validatorHandler(gradientSchema, 'body'),
  tokenDecoderHandler,
  saveGradient
)

router.post(
  '/unsave',
  validatorHandler(gradientSchema, 'body'),
  tokenDecoderHandler,
  unsaveGradient
)

module.exports = router