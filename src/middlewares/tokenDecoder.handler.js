const jwt = require('jsonwebtoken')
const boom = require('@hapi/boom')
const config = require('../config/config')

const User = require('../models/user.model')

async function tokenDecoderHandler(req, res, next) {
  const authorization = req.get('authorization')
  let token = null

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.split(' ')[1]
  }
  
  jwt.verify(token, config.SECRET, async function(error, decoded) {
    if (error) {
      next(boom.unauthorized('Missing or invalid token.'))
      return
    }

    const { id } = decoded

    const userExists = await User.findById(id)
  
    if (!userExists) {
      next(boom.notFound('User does not exist.'))
      return
    }
  
    req.userId = id
    next()
  })
}

module.exports = { tokenDecoderHandler }