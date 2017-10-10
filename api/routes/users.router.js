const express = require('express');
const authController = require('../auth/controllers/auth.controller');
const userController = require('../auth/controllers/user.controller');
const jsonParse = require('body-parser').json();

const router = express.Router();

router
  .route('/')
  .post(authController.isAuthenticated, jsonParse, userController.addUser)
  .get(authController.isAuthenticated, userController.getUsers);

router
  .route('/all')
  .post(authController.isAuthenticated, jsonParse, userController.addUser)
  .get(authController.isAuthenticated, userController.getUsers);

router
  .route('/all/meta')
  .get(authController.isAuthenticated, userController.getUserMeta);

router
  .route('/all/:shortId')
  .get(authController.isAuthenticated, userController.getUserByShortId)
  .put(authController.isAuthenticated, jsonParse, userController.updateUser);
  
router.route('/login').post(jsonParse, userController.login);

module.exports = router;
