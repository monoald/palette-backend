const UserService = require('../service/user.service')

const service = new UserService

const signUp = (req, res, next) => {
  try {
    const newUser = service.create(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
}

const signIn = (req, res) => {
  res.send('signin')
}

module.exports = { signUp, signIn }