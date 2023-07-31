const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')

const { SECRET } = require('../config/config')
const User = require('../models/user.model')

const jwtSignin = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: SECRET
  },
  async (payload, done) => {
    try {
      const user = await user.findById(payload.id)

      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    } catch (error) {
      done(error, false)
    }
  }
)

passport.use(jwtSignin)