const express = require('express')
const models = require('./models.router')
const assets = require('./assets.router')
const users = require('./users.router')
const categories = require('./categories.router')
const pos = require('./pos.router')

const router = express.Router()

router.use('/users', users)
router.use('/models', models)
router.use('/categories', categories)
router.use('/assets', assets)
router.use('/pos', pos)

module.exports = router
