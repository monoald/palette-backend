const Joi = require('joi')

const email = Joi.string().email()
const password = Joi.string().min(8)
const username = Joi.string().min(3).max(10)

const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  username: username.required()
})

const updateUserSchema = Joi.object({
  password: password,
  username: username
})

const getUserSchema = Joi.object({
  email: email.required(),
})

const signInSchema = Joi.object({
  email: email.required(),
  password: password.required()
})

module.exports = { createUserSchema, updateUserSchema, getUserSchema, signInSchema }