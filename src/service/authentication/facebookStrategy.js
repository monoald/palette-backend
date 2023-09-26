const passport = require('passport')
const { Strategy } = require('passport-facebook')
const { default: axios } = require('axios')

const { generateSignInKey } = require('../../utils/generateSignInKey')

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
      if (oldUser) {
        oldUser.signInKey = generateSignInKey()
        oldUser.save()
        return done(null, oldUser)
      } else {
        let image 
        await axios
          .get(profile.photos[0].value, {
            responseType: 'arraybuffer'
          })
          .then(response => {
            image = Buffer.from(response.data, 'binary').toString('base64')
          })

        const newUser = await new User({
          name: profile._json.name,
          username: profile.username || `user${profile.id}`,
          avatar: image,
          provider: 'facebook',
          facebookId: profile.id,
          signInKey: generateSignInKey()
        }).save()

        done(null, newUser)
      }
    } catch (error) {
      console.log(error)
    }
  }
)

module.exports = { facebookSignIn }