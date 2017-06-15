const express = require('express')
const assetController = require('./controllers/asset.controller')
const authController = require('../auth/controllers/auth.controller')
const router = express.Router()
const jsonParse = require('body-parser').json()

router.route('/')
  .get(authController.isAuthenticated, assetController.getAssets)
  .post(authController.isAuthenticated, jsonParse, assetController.addAsset)

router.route('/all')
  .get(authController.isAuthenticated, assetController.getAllAssets)
  .post(authController.isAuthenticated, jsonParse, assetController.addAsset)

router.route('/:shortId')
  .get(authController.isAuthenticated, assetController.getAssetsByShortId)

router.route('/all/:shortId')
  .get(authController.isAuthenticated, assetController.getAssetByShortId)
  .put(authController.isAuthenticated, jsonParse, assetController.updateAsset)
  .delete(authController.isAuthenticated, assetController.removeAsset)

module.exports = router
