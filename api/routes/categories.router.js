const express = require('express')
const authController = require('../auth/controllers/auth.controller')
const categoryController = require('./controllers/category.controller')
const { categoryModel } = require('../js/schema')

const router = express.Router()
var db = {}
db.Category = categoryModel

router.route('/')
  .get(authController.isAuthenticated, categoryController.getCategories)

module.exports = router
