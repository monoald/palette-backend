const https = require('https')
const fs = require('fs')

const { STATUS } = require('../src/config/config')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const passport = require('passport')

const { PORT } = require('../src/config/config')
const { corsOptions } = require('../src/config/corsOptions')

const { errorHandler, boomErrorHandler } = require('../src/middlewares/error.handler')
const { googleSignin } = require('../src/service/authentication/googleStrategy')
const { facebookSignIn } = require('../src/service/authentication/facebookStrategy')
const { githubSignIn } = require('../src/service/authentication/githubStrategy')
const routerApi = require('../src/routes')

require('./database')

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

module.exports = app

if (STATUS === 'dev') {
  const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }
  
  const server = https.createServer(options, app).listen(app.get('port'), () => {
    console.log('https server running at port: ' + app.get('port'));
  })
} else {
  app.listen(app.get('port'))
  console.log('Server on port', app.get('port'))
}