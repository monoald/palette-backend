const clientUrl = 'http://localhost:5173'

const sendCredentials = async (req, res, next) => {
  try {
    const token = req.user.generateJWT();
    res.cookie('user', {
      name: req.user.name,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      id: req.user.id,
    })
    res.cookie('token', token)
    res.redirect(clientUrl)
  } catch (error) {
    next(error)
  }
}

module.exports = { sendCredentials }