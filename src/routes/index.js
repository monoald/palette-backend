const express = require('express')

const usersRouter = require('./user.router')
const palettesRouter = require('./palette.router')
const colorsRouter = require('./color.router')

function routerApi(app) {
  const router = express.Router()

  app.use('/api/v1', router)

  router.use('/users', usersRouter)
  router.use('/palettes', palettesRouter)
  router.use('/colors', colorsRouter)
}

module.exports = routerApi