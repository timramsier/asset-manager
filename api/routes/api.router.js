const express = require('express')
const assets = require('./assets.router')
const mongoose = require('mongoose')
const { categorySchema } = require('../js/schema')

const router = express.Router()
var db = {}
db.Category = mongoose.model('Category', categorySchema)

router.get('/category', (req, res) => {
  db.Category
  .find({}, 'name label description config')
  .exec((err, result) => {
    if (err) res.send(err)
    res.send(JSON.stringify(result))
  })
})

router.use('/assets', assets)

module.exports = router
