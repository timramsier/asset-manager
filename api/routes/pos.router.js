const express = require('express')
const authController = require('../auth/controllers/auth.controller')
const poController = require('./controllers/po.controller')
const jsonParse = require('body-parser').json()

const router = express.Router()

router.route('/')
  .get(authController.isAuthenticated, poController.getPos)
  .post(authController.isAuthenticated, jsonParse, poController.addPo)

router.route('/all')
  .get(authController.isAuthenticated, poController.getPos)

router.route('/:poNumber')
  .get(authController.isAuthenticated, poController.getByPONum)

router.route('/all/meta')
  .get(authController.isAuthenticated, poController.getPoMeta)

router.route('/all/:shortId')
  .get(authController.isAuthenticated, poController.getPoByShortId)
  .delete(authController.isAuthenticated, poController.removePo)
  .put(authController.isAuthenticated, jsonParse, poController.updatePo)

module.exports = router
