const ImageService = require('../service/image.service')

const service = new ImageService

const getBase64Image = async (req, res, next) => {
  try {
    const { url } = req.body

    const base64 = await service.toBase64(url)
    res.status(200).json(base64)
  } catch (error) {
    next(error)
  }
}

module.exports = { getBase64Image }
