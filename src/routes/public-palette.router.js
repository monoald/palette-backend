const { Router } = require('express')

const { getPublicPalettes } = require('../controllers/public-palette.controller')

const router = Router()

router.get('/',
  getPublicPalettes
)


module.exports = router