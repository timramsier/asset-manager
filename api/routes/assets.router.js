const express = require('express')
const assetController = require('../js/asset.controller')
const authController = require('../auth/controllers/auth')
const router = express.Router()

router.route('/')
  .get(authController.isAuthenticated, assetController.getAssets)

router.route('/:shortId')
  .get(authController.isAuthenticated, assetController.getAssetsByShortId)

module.exports = router
