const express = require('express')
const authController = require('../auth/controllers/auth.controller')
const categoryController = require('./controllers/category.controller')
const jsonParse = require('body-parser').json()

const router = express.Router()

router.route('/')
  .get(authController.isAuthenticated, categoryController.getCategories)
  .post(authController.isAuthenticated, jsonParse, categoryController.addCategory)

router.route('/:shortId')
  .get(authController.isAuthenticated, categoryController.getCategory)
  .delete(authController.isAuthenticated, categoryController.removeCategory)
  .put(authController.isAuthenticated, jsonParse, categoryController.updateCategory)

module.exports = router
