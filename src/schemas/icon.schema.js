const Joi = require('joi')

const name = Joi.string().min(4)
const icons = Joi.array().items(Joi.object({
  name: Joi.string(),
  content: Joi.string(),
  unicode: Joi.string(),
  color: Joi.string()
}))
const color = Joi.string()
const thumbnail = Joi.string()
const id = Joi.string()
const page = Joi.number()

const iconSchema = Joi.object({
  name: name.required(),
  icons: icons.required(),
  thumbnail: thumbnail.required(),
  color: color
})

const updateIconSchema = Joi.object({
  name: name,
  icons: icons,
  color: color
})

const getIconSchema = Joi.object({
  id: id.required()
})

const getIconsPaginationSchema = Joi.object({
  page: page.required()
})

const downloadFontSchema = Joi.object({
  name: name.required()
})

module.exports = { iconSchema, getIconsPaginationSchema, getIconSchema, updateIconSchema, downloadFontSchema }