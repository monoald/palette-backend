const { Strategy } = require("passport-google-oauth20")
const passport = require("passport")

const User = require("../../models/user.model")
const { GOOGLE_CLIENT_ID, GOOGLE_SECRET } = require("../../config/config")

const serverUrl = 'http://localhost:3000'

const googleSignin = new Strategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET,
    callbackURL: `${serverUrl}/api/v1/auth/google/callback`,
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const oldUser = await User.findOne({ email: profile.email })

      if (oldUser) {
        return done(null, oldUser)
      }
    } catch (error) {
      
    }

    try {
      const oldUser = await User.findOne({ email: profile._json.email })
      if (oldUser) {
        done(null, oldUser)
        return
      }
      const newUser = await new User({
        email: profile._json.email,
        name: profile._json.name,
        username: `user${profile._json.sub}`,
        avatar: profile._json.picture,
        provider: 'google',
        googleId: profile._json.sub,
      }).save()

      done(null, newUser)
    } catch (error) {
      console.log(error);
    }
  }
)

passport.use('google', googleSignin)