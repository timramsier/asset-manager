const { modelModel, categoryModel } = require('../../js/schema')
const _controller = require('./_.controller')

var db = {}
db.Category = categoryModel
db.Model = modelModel

module.exports = {
  getModels: (req, res) => {
    db.Model
    .find()
    .populate('models lastModifiedBy', 'username firstName lastName email')
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
      if (result.length < 1) {
        res.status(400).send(JSON.stringify([]))
      } else {
        if (req.params.productType.toLowerCase() !== 'all') {
          search._parent = result[0]._id
        }
        db.Model
        .find(search, score)
        .sort(sort)
        .populate('_parent lastModifiedBy', 'name firstName lastName email description label config _shortId username')
        .exec((err, result) => {
          if (err) res.send(err)
          res.send(JSON.stringify(result))
        })
      }
    })
  },
  getAllModels: _controller(db.Model).getAll,
  getModelByShortId: _controller(db.Model).getOne,
  addModel: _controller(db.Model).add,
  removeModel: _controller(db.Model).remove,
  updateModel: _controller(db.Model).update
}
