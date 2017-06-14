const { modelModel, categoryModel, assetModel } = require('../../js/schema')
const userModel = require('../../auth/schema')

var db = {}
db.Category = categoryModel
db.Model = modelModel
db.Asset = assetModel
db.User = userModel

const _searchAssets = (req, res, search, score, sort) => {
  db.Asset
  .find(search, score)
  .sort(sort)
  .populate('_parent assignedTo lastModifiedBy', 'username accessLevel firstName lastName email vendor name category description active image _shortId')
  .exec((err, result) => {
    if (err) res.send(err)
    res.send(JSON.stringify(result))
  })
}

module.exports = {

  getAssets: (req, res) => {
    var search = {}
    var score = {}
    var sort = {}
    req.query.status ? search.status = req.query.status : undefined

    if (req.query.search) {
      search['$text'] = {$search: decodeURIComponent(req.query.search)}
      score = { score: { $meta: 'textScore' } }
      sort = { score: { $meta: 'textScore' } }
      db.User
      .find(search, score)
      .sort(sort)
      .exec((err, result) => {
        if (err) res.send(err)
        result.forEach((user) => {
          search['$text']['$search'] += ` ${user._id}`
        })
        _searchAssets(req, res, search, score, sort)
      })
    } else {
      _searchAssets(req, res, search, score, sort)
    }
  },
  getAssetsByShortId: (req, res) => {
    var search = {}
    var score = {}
    var sort = {}
    req.query.status ? search.status = req.query.status : undefined
    db.Model.find({ _shortId: req.params.shortId }).exec((err, result) => {
      if (err) res.send(err)
      if (req.params.shortId.toLowerCase() !== 'all') {
        search._parent = result[0]._id
      }

      if (req.query.search) {
        search['$text'] = {$search: decodeURIComponent(req.query.search)}
        score = { score: { $meta: 'textScore' } }
        sort = { score: { $meta: 'textScore' } }
        db.User
        .find({$text: search['$text']}, score)
        .sort(sort)
        .exec((err, result) => {
          if (err) res.send(err)
          result.forEach((user) => {
            search['$text']['$search'] += ` ${user._id}`
          })
          _searchAssets(req, res, search, score, sort)
        })
      } else {
        _searchAssets(req, res, search, score, sort)
      }
    })
  }
}
