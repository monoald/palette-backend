const https = require('https')
const fs = require('fs')

const app = require('./app')
const { STATUS } = require('./config/config')

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



