const { Strategy } = require("passport-github2");
const { default: axios } = require('axios')

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
          email: profile._json.email | undefined,
          name: profile._json.name,
          username: `user${profile._json.login}`,
          avatar: image,
          provider: 'github',
          githubId: profile._json.id,
          signInKey: generateSignInKey()
        }).save()

        done(null, newUser)
      }
    } catch (error) {
      console.log(error)
    }
  }
)

module.exports = { githubSignIn }