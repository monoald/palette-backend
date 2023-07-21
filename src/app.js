const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const config = require('./config/config')
const {corsOptions} = require('./config/corsOptions')

const { errorHandler, boomErrorHandler } = require('./middlewares/error.handler')
const routerApi = require('./routes')

require('./database')

// initializations
const app = express()

// settings
app.set('port', config.PORT)

// middlewares
app.use(morgan('dev'))
app.use(cors(corsOptions))
app.use(cookieParser())
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