const Joi = require('joi')

const colors = Joi.string()
const userId = Joi.string()
const id = Joi.string()
const page = Joi.number()

const paletteSchema = Joi.object({
  colors: colors.required()
})

const getPaletteSchema = Joi.object({
  id: id.required()
})

const getPalettesPaginationSchema = Joi.object({
  page: page.required()
})

module.exports = { paletteSchema, getPaletteSchema, getPalettesPaginationSchema }