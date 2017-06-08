const express = require('express')
const mongoose = require('mongoose')
const models = require('./models.router')
const assets = require('./assets.router')
const mainController = require('../js/main.controller')
const userController = require('../auth/controllers/user')
const authController = require('../auth/controllers/auth')
const { categorySchema } = require('../js/schema')

const router = express.Router()
var db = {}
db.Category = mongoose.model('Category', categorySchema)

router.route('/category')
  .get(authController.isAuthenticated, mainController.getCategories)

router.route('/users')
  .post(userController.postUsers)
  .get(userController.getUsers)

router.use('/models', models)
router.use('/assets', assets)

module.exports = router
