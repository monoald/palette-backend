const { Router } = require("express");

const { validatorHandler } = require("../middlewares/validator.handler");
const { gradientSchema, getGradientSchema } = require("../schemas/gradient.schema");
const { tokenDecoderHandler } = require("../middlewares/tokenDecoder.handler");
const { createPublicGradient, getPublicGradients, getPublicGradient } = require("../controllers/public-gradient.controller");

const router = Router()

router.get(
  '/',
  getPublicGradients
)

router.get(
  '/:id',
  validatorHandler(getGradientSchema, 'params'),
  getPublicGradient
)

router.post(
  '/',
  validatorHandler(gradientSchema, 'body'),
  tokenDecoderHandler,
  createPublicGradient
)

module.exports = router