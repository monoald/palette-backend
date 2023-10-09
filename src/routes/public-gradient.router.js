const { Router } = require('express');

const { validatorHandler } = require('../middlewares/validator.handler');
const { gradientSchema, getGradientPaginationSchema } = require('../schemas/gradient.schema');
const { tokenDecoderHandler } = require('../middlewares/tokenDecoder.handler');
const { createPublicGradient, getPublicGradients } = require('../controllers/public-gradient.controller');

const router = Router()

router.get(
  '/',
  validatorHandler(getGradientPaginationSchema, 'query'),
  getPublicGradients
)

router.post(
  '/',
  validatorHandler(gradientSchema, 'body'),
  tokenDecoderHandler,
  createPublicGradient
)

module.exports = router