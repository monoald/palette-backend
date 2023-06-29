const Joi = require('joi')

const email = Joi.string().email()
const password = Joi.string().min(8)

const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required()
})

const updateUserSchema = Joi.object({
  email: email.required(),
})

const getUserSchema = Joi.object({
  email: email.required(),
})

module.exports = { createUserSchema, updateUserSchema, getUserSchema }