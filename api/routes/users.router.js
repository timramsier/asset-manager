const express = require('express')
const authController = require('../auth/controllers/auth.controller')
const userController = require('../auth/controllers/user.controller')
const jsonParse = require('body-parser').json()

const router = express.Router()

router.route('/')
  .post(authController.isAuthenticated, userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers)

router.route('/all')
  .post(authController.isAuthenticated, userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers)

router.route('/login')
  .post(jsonParse, userController.login)

module.exports = router
