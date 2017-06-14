const express = require('express')
const models = require('./models.router')
const assets = require('./assets.router')
const mainController = require('./controllers/main.controller')
const userController = require('../auth/controllers/user.controller')
const authController = require('../auth/controllers/auth.controller')
const { categoryModel } = require('../js/schema')

const router = express.Router()
var db = {}
db.Category = categoryModel

router.route('/category')
  .get(authController.isAuthenticated, mainController.getCategories)

router.route('/users')
  .post(userController.postUsers)
  .get(userController.getUsers)

router.use('/models', models)
router.use('/assets', assets)

module.exports = router
