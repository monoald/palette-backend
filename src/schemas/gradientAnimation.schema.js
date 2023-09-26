const Joi = require('joi')

const name = Joi.string().min(6)
const id = Joi.string()
const page = Joi.number()

const gradientAnimationSchema = Joi.object({
  name: name.required()
})

const getGradientAnimationSchema = Joi.object({
  id: id.required()
})

const getGradientAnimationPaginationSchema = Joi.object({
  page: page.required()
})

module.exports = { gradientAnimationSchema, getGradientAnimationSchema, getGradientAnimationPaginationSchema }