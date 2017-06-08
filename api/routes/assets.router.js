const express = require('express')
const mongoose = require('mongoose')
const assetController = require('../js/asset.controller')
const authController = require('../auth/controllers/auth')
const { modelSchema, categorySchema, assetSchema } = require('../js/schema')
const router = express.Router()

var db = {}
db.Category = mongoose.model('Category', categorySchema)
db.Model = mongoose.model('Model', modelSchema)
db.Assets = mongoose.model('Asset', assetSchema)

router.route('/')
  .get(authController.isAuthenticated, assetController.getAssets)

router.route('/:shortId')
  .get(authController.isAuthenticated, assetController.getAssetsByShortId)

module.exports = router
