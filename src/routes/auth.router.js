const { Router } = require('express')
const passport = require('passport')
const { sendCredentials } = require('../controllers/auth.controller')
const { CLIENT_URI } = require('../config/config')

const router = Router()

router.get(
  '/google/callback',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    failureRedirect: `${CLIENT_URI}/signin`,
    session: false,
  }),
  sendCredentials
)

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    scope: 'public_profile',
    failureRedirect: `${CLIENT_URI}/signin`,
    session: false,
  }),
  sendCredentials
)

module.exports = router