require('dotenv').config()

const config = {
  PORT: process.env.PORT || 3000,
  DB_URI: process.env.DB_URI,
  SECRET: process.env.JWT_SECRET,
  COOKIE_KEY: process.env.COOKIE_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
}

module.exports = config