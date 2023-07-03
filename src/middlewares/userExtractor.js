const jwt = require('jsonwebtoken')
const boom = require('@hapi/boom')
const config = require('../config/config')

function userExtractor(req, res, next) {
  const authorization = req.get('authorization')
  let token = null
  let decodedToken = null
  
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.split(' ')[1]
  }

  try {
    decodedToken = jwt.verify(token, config.SECRET)
  } catch(err) {
    throw boom.unauthorized('Missing or invalid token.')
  }


  const { id: userId } = decodedToken

  req.userId = userId

  next()
}

module.exports = { userExtractor }