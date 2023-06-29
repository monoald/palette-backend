const { Router } = require('express')

const { signIn, signUp } = require('../controllers/user.controller')
const { validatorHandler } = require('../middlewares/validator.handler')
const { createUserSchema } = require('../schemas/user.schema')

const router = Router()

router.post(
  '/signup',
  validatorHandler(createUserSchema, 'body'),
  signUp
)

router.post('/signin', signIn)

module.exports = router