const { Router } = require('express')
const passport = require('passport')
const { sendCredentials } = require('../controllers/auth.controller')

const router = Router()

router.get(
  '/google/callback',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    failureRedirect: '/',
    session: false,
  }),
  sendCredentials
)

module.exports = router