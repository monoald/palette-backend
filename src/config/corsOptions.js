const { CLIENT_URI } = require("./config");

const allowedOrigins = [CLIENT_URI]

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}

module.exports = { corsOptions }