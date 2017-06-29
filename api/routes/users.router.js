const express = require('express')
const userController = require('../auth/controllers/user.controller')

const router = express.Router()

router.route('/')
  .post(userController.postUsers)
  .get(userController.getUsers)

router.route('/all')
  .post(userController.postUsers)
  .get(userController.getUsers)

module.exports = router
