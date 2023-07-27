const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieSession = require('cookie-session')
const passport = require('passport')

const { PORT } = require('./config/config')
const { corsOptions } = require('./config/corsOptions')
const { sessionOptions } = require('./config/sessionOptions')

const { errorHandler, boomErrorHandler } = require('./middlewares/error.handler')
const routerApi = require('./routes')

require('./database')

// initializations
const app = express()

// settings
app.set('port', PORT)

// middlewares
app.use(cookieSession(sessionOptions))
app.use(cors(corsOptions))
app.use(morgan('dev'))

app.use(passport.initialize())
require('./authentication/googleStrategy')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

routerApi(app)

app.use(boomErrorHandler)
app.use(errorHandler)

// routes
app.get('/', (req, res) => {
  // res.send(`THE API is at http://localhost:${app.get('port')}`)
})


module.exports = app