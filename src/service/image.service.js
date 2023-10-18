const boom = require('@hapi/boom')
const axios = require('axios')

class ImageService {
  constructor() {}

  async toBase64(url) {
    const base64 = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer'
    })
      .then(response => Buffer.from(response.data, 'binary').toString('base64'))
      .catch(() => {
        throw boom.notFound('The url you provide does not belongs to a valid image.')
      })

    return base64
  }
}

module.exports = ImageService