const { Router } = require('express')

const { signIn, signUp, getUsers, getUser, updateUser, deleteUser } = require('../controllers/user.controller')
const { validatorHandler } = require('../middlewares/validator.handler')
const { createUserSchema, getUserSchema, updateUserSchema, signInSchema } = require('../schemas/user.schema')

const router = Router()

router.get('/',
  getUsers
)

router.get('/:email',
  validatorHandler(getUserSchema, 'params'),
  getUser
)

router.patch('/:email',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  updateUser
)

router.delete('/:email',
  validatorHandler(getUserSchema, 'params'),
  deleteUser
)

router.post(
  '/signup',
  validatorHandler(createUserSchema, 'body'),
  signUp
)

router.post('/signin',
  validatorHandler(signInSchema, 'body'),
  signIn
)

module.exports = router