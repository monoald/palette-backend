const Joi = require('joi')

const signInKey = Joi.string().length(20)

const signInAuthSchema = Joi.object({
  key: signInKey.required()
})

module.exports = { signInAuthSchema }