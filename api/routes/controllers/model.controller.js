const { modelModel, categoryModel } = require('../../js/schema')
const _controller = require('./_.controller')

let Category = categoryModel
let Model = modelModel

const getModelsByCategory = (req, res, next) => {
  _controller(Category, {}, {
    label: req.params.productType.toLowerCase()
  }).getOne(req, res, next, (err, category) => {
    if (err) return res.status(400).send(err)
    if (!category) {
      return res.status(400).send(`Category with name ${req.params.productType} not found.`)
    } else {
      let query = req.query
      Object.assign(query, {_parent: category._id})
      _controller(Model, {
        populate: '_parent lastModifiedBy',
        popFields: 'name firstName lastName email description label config _shortId username'
      },
      query
    ).getAll(req, res, next)
    }
  })
}

const getModelByShortId = (req, res, next) => {
  _controller(Model, {}, {_shortId: req.params.shortId})
  .getOne(req, res, next)
}

module.exports = {
  getModelsByCategory,
  getModelByShortId,
  getAllModels: _controller(Model,
    { populate: '_parent lastModifiedBy',
      popFields: 'name firstName lastName email description label config _shortId username'
    }).getAll,
  addModel: _controller(Model).add,
  removeModel: _controller(Model).remove,
  updateModel: _controller(Model).update,
  getModelMeta: _controller(Model).getMeta
}
