const express = require('express')

const usersRouter = require('./user.router')
const palettesRouter = require('./palette.router')

function routerApi(app) {
  const router = express.Router()

  app.use('/api/v1', router)

  router.use('/users', usersRouter)
  router.use('/palettes', palettesRouter)
}

module.exports = routerApi