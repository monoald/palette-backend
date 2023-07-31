const { Router } = require('express')

const { signIn, signUp, getUsers, getUser, updateUser, deleteUser, getPalettesByUser } = require('../controllers/user.controller')
const { validatorHandler } = require('../middlewares/validator.handler')
const { createUserSchema, getUserSchema, updateUserSchema, signInSchema } = require('../schemas/user.schema')
const { tokenDecoderHandler } = require('../middlewares/tokenDecoder.handler')

const User = require('../models/user.model')
const passport = require('passport')

const router = Router()

router.get('/', getUsers)

router.get(
  '/:id',
  tokenDecoderHandler,
  validatorHandler(getUserSchema, 'params'),
  getUser
)

router.patch(
  '/:id',
  tokenDecoderHandler,
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  updateUser
)

router.delete(
  '/:id',
  validatorHandler(getUserSchema, 'params'),
  deleteUser
)

router.post(
  '/signup',
  validatorHandler(createUserSchema, 'body'),
  signUp
)

router.post(
  '/signin',
  validatorHandler(signInSchema, 'body'),
  signIn
)

module.exports = router