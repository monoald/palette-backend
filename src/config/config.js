require('dotenv').config()
const env = process.env

const config = {
  PORT: env.PORT || 3000,
  STATUS: env.STATUS,
  DB_URI: env.DB_URI,
  CLIENT_URI: env.STATUS === 'dev' ? env.CLIENT_URI_DEV : env.CLIENT_URI_PROD,
  SERVER_URI: env.STATUS === 'dev' ? env.SERVER_URI_DEV : env.SERVER_URI_PROD,
  SECRET: env.JWT_SECRET,
  COOKIE_KEY: env.COOKIE_KEY,
  GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
  GOOGLE_SECRET: env.GOOGLE_SECRET,
  FACEBOOK_APP_ID: env.FACEBOOK_APP_ID,
  FACEBOOK_SECRET: env.FACEBOOK_SECRET,
  GITHUB_CLIENT_ID: env.GITHUB_CLIENT_ID,
  GITHUB_SECRET: env.GITHUB_SECRET,
}

module.exports = config