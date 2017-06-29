const express = require('express')
const assetController = require('./controllers/asset.controller')
const authController = require('../auth/controllers/auth.controller')
const router = express.Router()
const jsonParse = require('body-parser').json()

router.route('/')
  .get(authController.isAuthenticated, assetController.getAllAssets)
  .post(authController.isAuthenticated, jsonParse, assetController.addAsset)

router.route('/all')
  .get(authController.isAuthenticated, assetController.getAllAssets)
  .post(authController.isAuthenticated, jsonParse, assetController.addAsset)

router.route('/:shortId')
  .get(authController.isAuthenticated, assetController.getAssetByShortId)

router.route('/all/meta')
  .get(authController.isAuthenticated, assetController.getAssetMeta)

router.route('/all/:shortId')
  .get(authController.isAuthenticated, assetController.getAssetsByModelId)
  .put(authController.isAuthenticated, jsonParse, assetController.updateAsset)
  .delete(authController.isAuthenticated, assetController.removeAsset)

module.exports = router
