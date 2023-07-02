const Joi = require('joi')

const colors = Joi.string()
const userId = Joi.string()
const id = Joi.string()

const paletteSchema = Joi.object({
  colors: colors.required(),
  userId: userId.required()
})

const getPaletteSchema = Joi.object({
  id: id.required()
})

const savePaletteSchema = Joi.object({
  colors: colors.required(),
  userId: userId.required()
})

const unsavePaletteSchema = Joi.object({
  id: id.required(),
  userId: userId.required()
})

module.exports = { paletteSchema, getPaletteSchema, savePaletteSchema, unsavePaletteSchema }