const express = require('express')
const models = require('./models.router')
const assets = require('./assets.router')
const users = require('./users.router')
const categories = require('./categories.router')

const router = express.Router()

router.use('/users', users)
router.use('/models', models)
router.use('/categories', categories)
router.use('/assets', assets)

module.exports = router
