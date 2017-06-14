const express = require('express')
const assetController = require('./controllers/asset.controller')
const authController = require('../auth/controllers/auth.controller')
const router = express.Router()

router.route('/')
  .get(authController.isAuthenticated, assetController.getAssets)

router.route('/:shortId')
  .get(authController.isAuthenticated, assetController.getAssetsByShortId)

module.exports = router
