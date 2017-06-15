const _controller = (model, properties = '') => {
  return ({
    getAll: (req, res, next, callback = (err, result) => {
      if (err) res.sendStatus(400)
      res.status(200).send(JSON.stringify(result))
    }) => {
      model
      .find({}, properties)
      .exec((err, result) => {
        if (err) res.send(err)
        callback(err, result)
      })
    },
    getOne: (req, res, next, callback = (err, result) => {
      if (err) res.sendStatus(400)
      res.status(200).send(JSON.stringify(result))
    }) => {
      model
      .find({_shortId: req.params.shortId}, properties)
      .exec((err, result) => {
        if (err) res.send(err)
        callback(err, result)
      })
    },
    add: (req, res, next, callback = (err, result) => {
      if (err) res.status(400).send(err)
      res.status(200).send(JSON.stringify(result))
    }) => {
      if (!req.body) return res.sendStatus(400)
      model.create(req.body, (err, result) => {
        if (err) res.sendStatus(400)
        callback(err, result)
      })
    },
    remove: (req, res, next, callback = (err, result) => {
      if (err) res.sendStatus(400)
      res.status(200).send(JSON.stringify(result))
    }) => {
      if (!req.body) return res.sendStatus(400)
      model.remove({_shortId: req.params.shortId}, (err) => {
        if (err) res.sendStatus(400)
        callback(err)
      })
    },
    update: (req, res, next, callback = (err, result) => {
      if (err) res.sendStatus(400)
      res.status(200).send(JSON.stringify(result))
    }) => {
      if (!req.body) return res.sendStatus(400)
      model.findOneAndUpdate({_shortId: req.params.shortId}, req.body, (err, category) => {
        if (err) res.sendStatus(400)
        callback(err)
      })
    }
  })
}

module.exports = _controller
