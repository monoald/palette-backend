const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const { errorHandler, boomErrorHandler } = require('./middlewares/error.handler')
const routerApi = require('./routes')

require('./database')

// initializations
const app = express()

// settings
app.set('port', process.env.PORT || 3000)

// middlewares
app.use(morgan('dev'))
app.use(cors())
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