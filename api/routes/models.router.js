const express = require('express')
const modelController = require('./controllers/models.controller')
const authController = require('../auth/controllers/auth.controller')
const router = express.Router()

router.route('/')
  .get(authController.isAuthenticated, modelController.getModels)

router.route('/:productType')
  .get(authController.isAuthenticated, modelController.getModelsByCategory)

module.exports = router
