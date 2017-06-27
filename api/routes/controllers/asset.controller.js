const { modelModel, assetModel, poModel } = require('../../js/schema')
const _controller = require('./_.controller')

let Asset = assetModel
let Model = modelModel
let Po = poModel

const addAsset = (req, res, next) => {
  _controller(Asset).add(req, res, next, (err, data) => {
    if (err) res.sendStatus(400)
    Model.findOneAndUpdate({_id: data._parent}, { $push: { assets: data._id } }, (err, result) => {
      if (err) res.status(400).send(err)
      res.status(200).send(result)
    })
  })
}

const removeAsset = (req, res, next) => {
  _controller(Asset).remove(req, res, next, (err, data) => {
    if (err) res.sendStatus(400)
    console.log(data)
    Model.findOneAndUpdate({_id: data._parent}, { $pull: { assets: data._id } }, (err, result) => {
      if (err) res.status(400).send(err)
      res.status(200).send(`Successfully Removed ${data._shortId}`)
    })
  })
}

const getAssetsByModelId = (req, res, next) => {
  _controller(Model, {}, {
    _shortId: req.params.shortId
  }).getOne(req, res, next, (err, model) => {
    if (err) res.status(400).send(err)
    if (!model) {
      res.status(400).send(`Model with _shortId ${req.params.shortId} not found.`)
    } else {
      let query = req.query
      let poQuery = {null: true} // forces an empty set
      if (query.search) { poQuery = { $text: { $search: query.search } } }
      Po.find(poQuery).exec((err, results) => {
        if (err) res.sendStatus(400)
        results.forEach((po) => {
          query.search += ` ${po._id}`
        })
        query._parent = model._id
        console.log(query)
        _controller(Asset,
          {
            populate: '_parent lastModifiedBy po',
            popFields: 'name firstName lastName email vendor name version description poNumber'
          },
          query
        ).getAll(req, res, next)
      })
    }
  })
}

const getAssetByShortId = (req, res, next) => {
  _controller(Asset, {
    populate: '_parent lastModifiedBy po',
    popFields: 'name firstName lastName email vendor name version description poNumber'
  }, {_shortId: req.params.shortId})
  .getOne(req, res, next)
}

module.exports = {
  addAsset,
  removeAsset,
  getAssetsByModelId,
  getAssetByShortId,
  getAllAssets: _controller(Asset, {
    populate: '_parent assignedTo lastModifiedBy po',
    popFields: 'username accessLevel firstName lastName email vendor name category description active image _shortId poNumber'
  }).getAll,
  updateAsset: _controller(Asset).update
}
