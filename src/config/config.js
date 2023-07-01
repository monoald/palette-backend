require('dotenv').config()

const config = {
  PORT: process.env.PORT || 3000,
  DB_URI: process.env.DB_URI,
  SECRET: process.env.JWT_SECRET,
}

module.exports = config