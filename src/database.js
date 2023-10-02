const mongoose = require('mongoose')
const config = require('./config/config')

mongoose.connect(config.DB_URI, {
  useNewUrlParser: true,
})

const connection = mongoose.connection

connection.on('error', err => {
  console.log(err);
  process.exit(0)
})

module.exports = { connection }