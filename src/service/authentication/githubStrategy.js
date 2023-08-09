const { Strategy } = require("passport-github2");
const { GITHUB_CLIENT_ID, GITHUB_SECRET, SERVER_URI } = require("../../config/config");
const { generateSignInKey } = require('../../utils/generateSignInKey')

const User = require('../../models/user.model')

const githubSignIn = new Strategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_SECRET,
    callbackURL: `${SERVER_URI}/auth/github/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const oldUser = await User.findOne({ githubId: profile._json.id })
      oldUser.signInKey = generateSignInKey()
      oldUser.save()

      if (oldUser) return done(null, oldUser)
    } catch (error) {
      console.log(error)
    }

    try {
      const newUser = await new User({
        email: profile._json.email | undefined,
        name: profile._json.name,
        username: `user${profile._json.login}`,
        avatar: profile._json.avatar_url,
        provider: 'github',
        githubId: profile._json.id,
        signInKey: generateSignInKey()
      }).save()

      done(null, newUser)
    } catch (error) {
      console.log(error)
    }
  }
)

module.exports = { githubSignIn }