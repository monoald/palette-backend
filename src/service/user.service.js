const User = require('../models/user.model')
const boom = require('@hapi/boom')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const config = require('../config/config')
const { selectRandomAvatar } = require('../utils/selectRandomAvatar')

class UserService {
  constructor() {}

  async create(data) {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(data.password, salt)

    data.password = hash

    data.avatar = selectRandomAvatar()

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
    const users = await User.find({})
      .populate('palettes', {
      'colors': 1,
      'length': 1,
      '_id': 0
      })
      .populate('colors', {
        'name': 1,
        '_id': 0
      })
      .populate('gradients', {
        'name': 1,
        '_id': 0
      })

    return users
  }

  async findOne(idFromParams, idFromToken) {
    if (idFromParams !== idFromToken) throw boom.notFound(`You have no access to this user.`)

    const user = await User.findById(idFromToken)
      .select('palettes colors gradients')
      .populate('palettes', {
        'colors': 1,
        'length': 1,
        'savedCount': 1,
        '_id': 1
      })
      .populate('colors', {
        'name': 1,
        '_id': 1
      })
      .populate('gradients', {
        'name': 1,
        'savedCount': 1,
        '_id': 1
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

    return {
      token, 
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        id: user.id,
        provider: user.provider
      }
    }
  }
}

module.exports = UserService