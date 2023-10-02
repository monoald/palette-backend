const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')

const { PORT } = require('./config/config')
const { corsOptions } = require('./config/corsOptions')

const { errorHandler, boomErrorHandler } = require('./middlewares/error.handler')
const { googleSignin } = require('./service/authentication/googleStrategy')
const { facebookSignIn } = require('./service/authentication/facebookStrategy')
const { githubSignIn } = require('./service/authentication/githubStrategy')
const routerApi = require('./routes')

const { connection } = require('./database')

// initializations
const app = express()

// settings
app.set('port', PORT)

// middlewares
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize())
passport.use('google', googleSignin)
passport.use('facebook', facebookSignIn)
passport.use('github', githubSignIn)

routerApi(app)

app.use(boomErrorHandler)
app.use(errorHandler)

connection.once('open', () => {
  app.listen(PORT, () => {
    console.log('Server on port: ' + PORT)
  })
})

module.exports = app