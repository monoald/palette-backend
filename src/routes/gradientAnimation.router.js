const { Router } = require("express");

const { validatorHandler } = require("../middlewares/validator.handler");
const { gradientAnimationSchema, getGradientAnimationSchema } = require("../schemas/gradientAnimation.schema");
const { tokenDecoderHandler } = require("../middlewares/tokenDecoder.handler");
const { createGradientAnimation, getGradientAnimations, getGradientAnimation, saveGradientAnimation, unsaveGradientAnimation } = require("../controllers/gradientAnimation.controller");

const router = Router()

router.get(
  '/',
  getGradientAnimations
)

router.get(
  '/:id',
  validatorHandler(getGradientAnimationSchema, 'params'),
  getGradientAnimation
)

router.post(
  '/',
  validatorHandler(gradientAnimationSchema, 'body'),
  tokenDecoderHandler,
  createGradientAnimation
)

router.post(
  '/save',
  validatorHandler(gradientAnimationSchema, 'body'),
  tokenDecoderHandler,
  saveGradientAnimation
)

router.post(
  '/unsave',
  validatorHandler(gradientAnimationSchema, 'body'),
  tokenDecoderHandler,
  unsaveGradientAnimation
)

module.exports = router