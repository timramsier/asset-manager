const express = require('express')
const authController = require('../auth/controllers/auth.controller')
const categoryController = require('./controllers/category.controller')
const { categoryModel } = require('../js/schema')
const jsonParse = require('body-parser').json()

const router = express.Router()
var db = {}
db.Category = categoryModel

router.route('/')
  .get(authController.isAuthenticated, categoryController.getCategories)
  .post(authController.isAuthenticated, jsonParse, categoryController.addCategory)

router.route('/:shortId')
  .delete(authController.isAuthenticated, jsonParse, categoryController.removeCategory)
  .put(authController.isAuthenticated, jsonParse, categoryController.updateCategory)

module.exports = router
