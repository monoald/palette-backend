const boom = require('@hapi/boom')
const User = require('../models/user.model')
const mongoose = require('mongoose')

class UserService {
  constructor() {}

  create(data) {
    const newUser = new User(data)

    const email = data.email
    const user = this.findOne(email)

    if (user) {
      throw boom.conflict(`User with email "${email} already exists"`)
    }

    newUser.save()
      .then(() => { mongoose.connection.close() })

    return newUser
  }

  find() {
    const users = User.find({})

    return users
  }

  findOne(email) {
    const user = User.findOne({ email })

    return user
  }

  update(email, password) {
    const user = User.findOneAndUpdate({ email }, { password })

    return user
  }

  delete(email) {
    const user = User.findOneAndDelete({ email })

    return user
  }
}

module.exports = UserService