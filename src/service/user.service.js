const User = require('../models/user.model')
const boom = require('@hapi/boom')
const config = require('../config/config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserService {
  constructor() {}

  async create(data) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(data.password, salt)

    data.password = hash

    const newUser = await User.collection.insertOne(data)
      .catch(error => {
        if (error.code === 11000) {
          if (Object.keys(error.keyValue).includes('email')) {
            throw boom.conflict('Email already registered')
          } else if (Object.keys(error.keyValue).includes('username')) {
            throw boom.conflict('Username already registered')
          }
        }
      })

    return { email: data.email, username: data.username }
  }

  async find() {
    const users = await User.find({}).populate('palettes', {
      'colors': 1,
      'length': 1,
      'savedCount': 1,
      '_id': 0
    })

    return users
  }

  async findOne(id) {
    const user = await User.findById(id).populate('palettes', {
      'colors': 1,
      'length': 1,
      'savedCount': 1,
      '_id': 0
    })

    if (user === null) {
      throw boom.notFound(`User not found.`)
    }

    return user
  }

  async update(id, data) {
    const user = await User.findOneAndUpdate({ id }, data)

    if (user === null) {
      throw boom.notFound(`User not found.`)
    }

    return user
  }

  async delete(id) {
    const user = await User.findOneAndDelete({ id })

    if (user === null) {
      throw boom.notFound(`User not found.`)
    }

    return user
  }

  async signIn({ email, password }) {
    const user = await User.findOne({ email })

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

    return { token }
  }
}

module.exports = UserService