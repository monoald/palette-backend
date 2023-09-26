const express = require('express')

const usersRouter = require('./user.router')
const palettesRouter = require('./palette.router')
const colorsRouter = require('./color.router')
const authRouter = require('./auth.router')
const gradientsRouter = require('./gradient.router')
const gradientAnimationsRouter = require('./gradientAnimation.router')
const iconsRouter = require('./icon.router')

function routerApi(app) {
  const router = express.Router()

  app.use('/api/v1', router)

  router.use('/users', usersRouter)
  router.use('/palettes', palettesRouter)
  router.use('/colors', colorsRouter)
  router.use('/auth', authRouter)
  router.use('/gradients', gradientsRouter)
  router.use('/gradient-animations', gradientAnimationsRouter)
  router.use('/icons', iconsRouter)
}

module.exports = routerApi