const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieSession = require('cookie-session')
const passport = require('passport')

const { PORT } = require('./config/config')
const { corsOptions } = require('./config/corsOptions')

const { errorHandler, boomErrorHandler } = require('./middlewares/error.handler')
const routerApi = require('./routes')

require('./database')

// initializations
const app = express()

// settings
app.set('port', PORT)

// middlewares
app.use(cors(corsOptions))
app.use(morgan('dev'))

app.use(passport.initialize())
require('./service/authentication/googleStrategy')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

routerApi(app)

app.use(boomErrorHandler)
app.use(errorHandler)


module.exports = app