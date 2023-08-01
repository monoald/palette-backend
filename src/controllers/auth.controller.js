const { CLIENT_URI } = require("../config/config");

const sendCredentials = async (req, res, next) => {
  try {
    const token = req.user.generateJWT();
    res.cookie('user', {
      name: req.user.name,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      id: req.user.id,
      provider: req.user.provider
    })
    res.cookie('token', token)
    res.redirect(CLIENT_URI)
  } catch (error) {
    next(error)
  }
}

module.exports = { sendCredentials }