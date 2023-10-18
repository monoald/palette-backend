const { Router } = require('express')

const { getBase64Image } = require('../controllers/image.controller')
const { validatorHandler } = require('../middlewares/validator.handler')
const { getBase64ImageSchema } = require('../schemas/image.schema')

const router = Router()

router.post(
  '/base64',
  validatorHandler(getBase64ImageSchema, 'body'),
  getBase64Image
)

module.exports = router