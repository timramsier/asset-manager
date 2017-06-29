const { poModel } = require('../../js/schema')
const _controller = require('./_.controller')

let Po = poModel

const getByPONum = (req, res, next) => {
  _controller(Po, {
    populate: 'createdBy lastModifiedBy',
    popFields: 'name firstName lastName email username'
  }, {poNumber: req.params.poNumber})
  .getOne(req, res, next)
}

const getPoByShortId = (req, res, next) => {
  _controller(Po, {}, {_shortId: req.params.shortId})
  .getOne(req, res, next)
}

module.exports = {
  getByPONum,
  getPoByShortId,
  getPos: _controller(Po, {
    populate: 'createdBy lastModifiedBy',
    popFields: 'name firstName lastName email username'
  }).getAll,
  addPo: _controller(Po).add,
  removePo: _controller(Po).remove,
  updatePo: _controller(Po).update
}
