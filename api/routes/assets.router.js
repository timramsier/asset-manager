const express = require('express')
const mongoose = require('mongoose')
const { modelSchema, categorySchema } = require('../js/schema')
const router = express.Router()

var db = {}
db.Category = mongoose.model('Category', categorySchema)
db.Model = mongoose.model('Model', modelSchema)

router.get('/', (req, res) => {
  db.Category
  .find()
  .populate('models')
  .exec((err, result) => {
    if (err) res.send(err)
    res.send(JSON.stringify(result))
  })
})

router.get('/:productType', (req, res) => {
  var search = {}
  if (req.query.active) {
    let active
    switch (req.query.active) {
      case 'true':
        active = true
        break
      case 'false':
        active = false
        break
    }
    search.active = active
  }
  db.Category.find({ label: req.params.productType }).exec((err, result) => {
    if (err) res.send(err)
    if (req.params.productType.toLowerCase() !== 'all') {
      search._parent = result[0]._id
    }

    db.Model
    .find(search)
    .populate('_parent', 'name description label config _shortId')
    .exec((err, result) => {
      if (err) res.send(err)
      res.send(JSON.stringify(result))
    })
  })
})

module.exports = router
