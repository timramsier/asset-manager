const mongoose = require('mongoose')
const { modelSchema, categorySchema } = require('../js/schema')

var db = {}
db.Category = mongoose.model('Category', categorySchema)
db.Model = mongoose.model('Model', modelSchema)

module.exports = {
  getModels: (req, res) => {
    db.Category
    .find()
    .populate('models lastModifiedBy', 'username')
    .exec((err, result) => {
      if (err) res.send(err)
      res.send(JSON.stringify(result))
    })
  },
  getModelsByCategory: (req, res) => {
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
    var score = {}
    var sort = {}
    if (req.query.search) {
      search['$text'] = {$search: decodeURIComponent(req.query.search)}
      score = { score: { $meta: 'textScore' } }
      sort = { score: { $meta: 'textScore' } }
    }

    db.Category.find({ label: req.params.productType }).exec((err, result) => {
      if (err) res.send(err)
      if (req.params.productType.toLowerCase() !== 'all') {
        search._parent = result[0]._id
      }
      db.Model
      .find(search, score)
      .sort(sort)
      .populate('_parent lastModifiedBy', 'name description label config _shortId username')
      .exec((err, result) => {
        if (err) res.send(err)
        res.send(JSON.stringify(result))
      })
    })
  }
}
