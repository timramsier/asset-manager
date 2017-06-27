const express = require('express')
const modelController = require('./controllers/model.controller')
const authController = require('../auth/controllers/auth.controller')
const router = express.Router()
const jsonParse = require('body-parser').json()

router.route('/')
  .get(authController.isAuthenticated, modelController.getAllModels)
  .post(authController.isAuthenticated, jsonParse, modelController.addModel)

router.route('/all')
  .get(authController.isAuthenticated, modelController.getAllModels)
  .post(authController.isAuthenticated, jsonParse, modelController.addModel)

router.route('/:productType')
  .get(authController.isAuthenticated, modelController.getModelsByCategory)

router.route('/all/:shortId')
  .get(authController.isAuthenticated, modelController.getModelByShortId)
  .put(authController.isAuthenticated, jsonParse, modelController.updateModel)
  .delete(authController.isAuthenticated, modelController.removeModel)

module.exports = router
