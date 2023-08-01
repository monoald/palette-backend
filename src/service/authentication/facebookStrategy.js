const passport = require('passport')
const { Strategy } = require('passport-facebook')

const User =  require('../../models/user.model')
const { FACEBOOK_APP_ID, FACEBOOK_SECRET, SERVER_URI } = require('../../config/config')

const facebookSignIn = new Strategy(
  {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_SECRET,
    callbackURL: `${SERVER_URI}/auth/facebook/callback`,
    profileFields: [
      'id',
      'emails',
      'displayName',
      'locale',
      'picture.type(large)'
    ]
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const oldUser = await User.findOne({ facebookId: profile.id })

      if (oldUser) return done(null, oldUser)
    } catch (error) {
      console.log(error);
    }

    try {
      const newUser = await new User({
        name: profile._json.name,
        username: profile.username || `user${profile.id}`,
        avatar: profile.photos[0].value,
        provider: 'facebook',
        facebookId: profile.id,
      }).save()

      done(null, newUser)
    } catch (error) {
      console.log(error);
    }
  }
)

module.exports = { facebookSignIn }