const mongoose = require('mongoose')
const { modelSchema, categorySchema } = require('../../js/schema')

var db = {}
db.Category = mongoose.model('Category', categorySchema)
db.Model = mongoose.model('Model', modelSchema)

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
