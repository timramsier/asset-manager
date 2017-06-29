const { categoryModel } = require('../../js/schema')
const _controller = require('./_.controller')

let Category = categoryModel

module.exports = {
  getCategories: _controller(Category, {properties: 'name label description config _shortId'}).getAll,
  getCategory: _controller(Category, {properties: 'name label description config _shortId'}).getOne,
  addCategory: _controller(Category).add,
  removeCategory: _controller(Category).remove,
  updateCategory: _controller(Category).update,
  getCategoryMeta: _controller(Category).getMeta
}
