const { categoryModel } = require('../../js/schema')
const _controller = require('./_.controller')

var db = {}
db.Category = categoryModel

module.exports = {
  getCategories: _controller(db.Category, {properties: 'name label description config _shortId'}).getAll,
  getCategory: _controller(db.Category, {properties: 'name label description config _shortId'}).getOne,
  addCategory: _controller(db.Category).add,
  removeCategory: _controller(db.Category).remove,
  updateCategory: _controller(db.Category).update
}
