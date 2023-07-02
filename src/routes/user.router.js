const { Router } = require('express')

const { signIn, signUp, getUsers, getUser, updateUser, deleteUser } = require('../controllers/user.controller')
const { validatorHandler } = require('../middlewares/validator.handler')
const { createUserSchema, getUserSchema, updateUserSchema, signInSchema } = require('../schemas/user.schema')

const router = Router()

router.get('/',
  getUsers
)

router.get('/:id',
  validatorHandler(getUserSchema, 'params'),
  getUser
)

router.patch('/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  updateUser
)

router.delete('/:id',
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