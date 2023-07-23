const jwt = require('jsonwebtoken')
const boom = require('@hapi/boom')
const config = require('../config/config')

const User = require('../models/user.model')

async function tokenDecoderHandler(req, res, next) {
  try {
    const authorization = req.get('authorization')
    let token = null
    let decodedToken = null
  
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      token = authorization.split(' ')[1]
    }
    
    jwt.verify(token, config.SECRET, async function(error, decoded) {
      if (error) {
        throw boom.unauthorized('Missing or invalid token.')
      }

      const { id } = decoded

      const userExists = await User.findById(id)
    
      if (!userExists) {
        throw boom.notFound('User does not exist.')
      }
    
      req.userId = id
      next()
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { tokenDecoderHandler }