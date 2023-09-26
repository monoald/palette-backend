const boom = require('@hapi/boom')
const jwt = require('jsonwebtoken')

const { CLIENT_URI, SECRET } = require("../config/config");

const User = require("../models/user.model");

const sendCredentials = async (req, res, next) => {
  try {
    const key = req.body.key
    const user = await User.findOne({ signInKey: key })
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
      .populate('gradient-animations', {
        'name': 1,
        'savedCount': 1,
        '_id': 1
      })
      .populate('icons', {
        'name': 1,
        'icons': 1,
        'color': 1,
        'thumbnail': 1,
        '_id': 1
      })

    if (!user || user.signInKey !== key) throw boom.notFound('Invalid key')

    user.signInKey = undefined
    user.save()

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      SECRET
    )

    res.json({
      token,
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        id: user.id,
        provider: user.provider,
        palettes: user.palettes,
        colors: user.colors,
        gradients: user.gradients,
        'gradient-animations': user['gradient-animations'],
        icons: user.icons
      }
    })
  } catch (error) {
    next(error)
  }
}

const sendKey = async (req, res, next) => {
  try {
    res.redirect(`${CLIENT_URI}/loader?key=${req.user.signInKey}`)
  } catch (error) {
    
  }
}

module.exports = { sendCredentials, sendKey }