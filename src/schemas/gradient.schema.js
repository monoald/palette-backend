const Joi = require('joi')

const name = Joi.string().min(6)
const id = Joi.string()
const page = Joi.number()

const gradientSchema = Joi.object({
  name: name.required()
})

const getGradientSchema = Joi.object({
  id: id.required()
})

const getGradientPaginationSchema = Joi.object({
  page: page.required()
})

module.exports = { gradientSchema, getGradientSchema, getGradientPaginationSchema }