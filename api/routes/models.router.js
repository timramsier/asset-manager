const express = require('express')
const mongoose = require('mongoose')
const modelController = require('../js/models.controller')
const authController = require('../auth/controllers/auth')
const { modelSchema, categorySchema } = require('../js/schema')
const router = express.Router()

var db = {}
db.Category = mongoose.model('Category', categorySchema)
db.Model = mongoose.model('Model', modelSchema)

router.route('/')
  .get(authController.isAuthenticated, modelController.getModels)

router.route('/:productType')
  .get(authController.isAuthenticated, modelController.getModelsByCategory)

module.exports = router
