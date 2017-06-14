const { categoryModel } = require('../../js/schema')

var db = {}
db.Category = categoryModel

module.exports = {
  getCategories: (req, res) => {
    db.Category
    .find({}, 'name label description config')
    .exec((err, result) => {
      if (err) res.send(err)
      res.send(JSON.stringify(result))
    })
  }
}
