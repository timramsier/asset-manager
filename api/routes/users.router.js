const express = require('express')
const authController = require('../auth/controllers/auth.controller')
const userController = require('../auth/controllers/user.controller')

const router = express.Router()

router.route('/')
  .post(authController.isAuthenticated, userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers)

router.route('/all')
  .post(authController.isAuthenticated, userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers)

module.exports = router
