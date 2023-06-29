const mongoose = require('mongoose')
const config = require('./config/config')

mongoose.connect(config.DB.URI, {
  useNewUrlParser: true,
})

const connection = mongoose.connection

connection.once('open', () => {
  console.log('MongoDB connection stablished');
})

connection.on('error', err => {
  console.log(err);
  process.exit(0)
})