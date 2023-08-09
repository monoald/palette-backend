const { Router } = require('express')
const passport = require('passport')
const { sendCredentials, sendKey } = require('../controllers/auth.controller')
const { CLIENT_URI } = require('../config/config')
const { validatorHandler } = require('../middlewares/validator.handler')
const { signInAuthSchema } = require('../schemas/auth.schema')

const router = Router()

router.get(
  '/google/callback',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    failureRedirect: `${CLIENT_URI}/signin`,
    session: false,
  }),
  sendKey
)

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    scope: 'public_profile',
    failureRedirect: `${CLIENT_URI}/signin`,
    session: false,
  }),
  sendKey
)

router.get(
  '/github/callback',
  passport.authenticate('github', {
    scope: 'user:email',
    failureRedirect: `${CLIENT_URI}/signin`,
    session: false,
  }),
  sendKey
)

router.post(
  '/signin',
  validatorHandler(signInAuthSchema, 'body'),
  sendCredentials
)

module.exports = router