const { Strategy } = require('passport-google-oauth20')
const passport = require('passport')
const { default: axios } = require('axios')

const User = require('../../models/user.model')
const { GOOGLE_CLIENT_ID, GOOGLE_SECRET, SERVER_URI } = require('../../config/config')
const { generateSignInKey } = require('../../utils/generateSignInKey')

const googleSignin = new Strategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET,
    callbackURL: `${SERVER_URI}/auth/google/callback`,
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const oldUser = await User.findOne({ googleId: profile._json.sub })
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
          email: profile._json.email,
          name: profile._json.name,
          username: `user${profile._json.sub}`,
          avatar: image,
          provider: 'google',
          googleId: profile._json.sub,
          signInKey: generateSignInKey()
        }).save()

        return done(null, newUser)
      }

    } catch (error) {
      console.log(error)
    }
  }
)

module.exports = { googleSignin }