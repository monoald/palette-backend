const User = require('../models/user.model')
const mongoose = require('mongoose')
const boom = require('@hapi/boom')
const config = require('../config/config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserService {
  constructor() {}

  async create(data) {
    const newUser = new User(data)

    const email = data.email
    const user = await User.findOne({ email })

    if (user) {
      throw boom.conflict(`User with email "${email}" already exists.`)
    }

    newUser.save()
      .then(() => { mongoose.connection.close() })

    return newUser
  }

  async find() {
    const users = await User.find({})

    return users
  }

  async findOne(email) {
    const user = await User.findOne({ email })

    if (user === null) {
      throw boom.notFound(`User not found.`)
    }

    return user
  }

  async update(email, data) {
    const user = await User.findOneAndUpdate({ email }, data)

    if (user === null) {
      throw boom.notFound(`User not found.`)
    }

    return user
  }

  async delete(email) {
    const user = await User.findOneAndDelete({ email })

    if (user === null) {
      throw boom.notFound(`User not found.`)
    }

    return user
  }

  async signIn({ email, password }) {
    const user = await this.findOne(email)

    const correctPassword = user === null
      ? false
      : await bcrypt.compare(password, user.password)

    if (!(user && correctPassword)) {
      throw boom.unauthorized('Invalid email or password.')
    }

    const userForToken = {
      id: user._id,
      email: user.email
    }

    const token = jwt.sign(userForToken, config.SECRET)

    return {
      email: user.email,
      token
    }
  }
}

module.exports = UserService