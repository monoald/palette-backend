const Joi = require('joi')

const email = Joi.string().email()
const password = Joi.string().min(6)
const username = Joi.string().min(4).max(15)
const id = Joi.string()

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
  id: id.required(),
})

const signInSchema = Joi.object({
  email: email.required(),
  password: password.required()
})

module.exports = { createUserSchema, updateUserSchema, getUserSchema, signInSchema }