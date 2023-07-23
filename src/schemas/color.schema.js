const Joi = require('joi')

const name = Joi.string().min(6).max(6)
const id = Joi.string()
const page = Joi.number()

const colorSchema = Joi.object({
  name: name.required()
})

const getColorSchema = Joi.object({
  id: id.required()
})

const getColorsPaginationSchema = Joi.object({
  page: page.required()
})

module.exports = { colorSchema, getColorSchema, getColorsPaginationSchema }