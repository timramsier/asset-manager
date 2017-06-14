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
  },
  addCategory: (req, res) => {
    if (!req.body) return res.sendStatus(400)
    db.Category.create(req.body, (err, category) => {
      if (err) res.sendStatus(400)
      res.status(200).send(JSON.stringify(category))
    })
  },
  removeCategory: (req, res) => {
    if (!req.body) return res.sendStatus(400)
    db.Category.remove({_shortId: req.params.shortId}, (err) => {
      if (err) res.sendStatus(400)
      res.status(200).send(JSON.stringify(`Successfully Removed ${req.params.shortId}`))
    })
  },
  updateCategory: (req, res) => {
    if (!req.body) return res.sendStatus(400)
    db.Category.findOneAndUpdate({_shortId: req.params.shortId}, req.body, (err, category) => {
      if (err) res.sendStatus(400)
      res.sendStatus(200)
    })
  }
}
