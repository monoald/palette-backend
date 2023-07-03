const Joi = require('joi')

const colors = Joi.string()
const userId = Joi.string()
const id = Joi.string()

const paletteSchema = Joi.object({
  colors: colors.required()
})

const getPaletteSchema = Joi.object({
  id: id.required()
})

module.exports = { paletteSchema, getPaletteSchema }