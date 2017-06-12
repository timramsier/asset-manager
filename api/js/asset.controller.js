const mongoose = require('mongoose')
const { modelSchema, categorySchema, assetSchema } = require('../js/schema')

var db = {}
db.Category = mongoose.model('Category', categorySchema)
db.Model = mongoose.model('Model', modelSchema)
db.Assets = mongoose.model('Asset', assetSchema)

module.exports = {
  getAssets: (req, res) => {
    var search = {}
    if (req.query.status) {
      search.status = req.query.status
    }
    var score = {}
    var sort = {}
    if (req.query.search) {
      search['$text'] = {$search: decodeURIComponent(req.query.search)}
      score = { score: { $meta: 'textScore' } }
      sort = { score: { $meta: 'textScore' } }
    }
    console.log(search)
    db.Assets
    .find(search, score)
    .sort(sort)
    .populate('_parent assignedTo lastModifiedBy', 'username accessLevel firstName lastName email vendor name category description active image _shortId')
    .exec((err, result) => {
      if (err) res.send(err)
      res.send(JSON.stringify(result))
    })
  },
  getAssetsByShortId: (req, res) => {
    var search = {}
    if (req.query.status) {
      search.status = req.query.status
    }
    var score = {}
    var sort = {}
    if (req.query.search) {
      search['$text'] = {$search: decodeURIComponent(req.query.search)}
      score = { score: { $meta: 'textScore' } }
      sort = { score: { $meta: 'textScore' } }
    }

    db.Model.find({ _shortId: req.params.shortId }).exec((err, result) => {
      if (err) res.send(err)
      if (req.params.shortId.toLowerCase() !== 'all') {
        search._parent = result[0]._id
      }
      console.log(search)
      db.Assets
      .find(search, score)
      .sort(sort)
      .populate('_parent assignedTo lastModifiedBy', 'username firstName lastName email vendor name category description active image _shortId')
      .exec((err, result) => {
        if (err) res.send(err)
        res.send(JSON.stringify(result))
      })
    })
  }
}
