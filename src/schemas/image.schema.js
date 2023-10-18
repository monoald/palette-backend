const Joi = require('joi')

const url = Joi.string().min(10)

const getBase64ImageSchema = Joi.object({
  url: url.required()
})

module.exports = { getBase64ImageSchema }